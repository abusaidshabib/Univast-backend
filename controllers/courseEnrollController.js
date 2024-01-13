const mongoose = require('mongoose');
const EnrollCourse = require("../models/courseEnrollModel");
const ResponseGenerator = require("../utils/ResponseGenerator");
const catchAsync = require("../utils/catchAsync");
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');

exports.createEnrollCourse = catchAsync(async (req, res, next) => {
    try {
      const { semester, courseId, teacherId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ status: 'failed', message: 'Invalid ObjectId for courseId or teacherId.' });
      }
  
      const enrollCourse = await EnrollCourse.findOne({ semester });
  
      if (enrollCourse) {
        const courseEntry = enrollCourse.courses.find(course => course.courseId.equals(courseId));
  
        if (courseEntry) {
          courseEntry.teachersId = teacherId;
        } else {
          enrollCourse.courses.push({
            courseId,
            teachersId: teacherId,
          });
        }
  
        await enrollCourse.save();
      } else {
        const newEnrollCourse = new EnrollCourse({
          semester,
          courses: [
            {
              courseId,
              teachersId: teacherId,
            },
          ],
        });
  
        await newEnrollCourse.save();
      }
  
      res.status(201).json({ status: 'success', message: 'Enrollment created successfully.' });
    } catch (error) {
      console.error('Error creating enrollment:', error);
      res.status(500).json({ status: 'failed', message: 'Internal Server Error.' });
    }
  });


  exports.getCourseEnrollmentData = catchAsync(async (req, res, next) => {
    let statusCode = 200;
    let result;

    const {semester, teacherId} = req.query;
  
    if(semester){
      result = await EnrollCourse.aggregate([
        {
          $match: { semester: semester },
        },
        {
          $unwind: '$courses',
        },
        {
          $lookup: {
            from: 'teachers',
            localField: 'courses.teachersId',
            foreignField: '_id',
            as: 'teacherData',
          },
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courses.courseId',
            foreignField: '_id',
            as: 'courseData',
          },
        },
        {
          $unwind: '$teacherData',
        },
        {
          $unwind: '$courseData',
        },
        {
          $group: {
            _id: '$_id',
            semester: { $first: '$semester' },
            combinedData: {
              $push: {
                firstName: '$teacherData.personal.firstName',
                lastName: '$teacherData.personal.lastName',
                email: '$teacherData.personal.email',
                courseCode: '$courseData.courseCode',
                courseName: '$courseData.courseName',
                credit: '$courseData.credit',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            semester: 1,
            combinedData: 1,
          },
        },
      ]);
    }
    else if (teacherId) {
      try {
        const tempResult = await EnrollCourse.find().populate({
          path: 'courses.courseId',
          model: 'Course',
        }).populate({
          path: 'courses.teachersId',
          model: 'Teacher',
        }).exec();
    
        const filteredData = {};
    
        tempResult.forEach(enrollment => {
          // Ensure that 'courses' array and its first element exist
          if (enrollment.courses && enrollment.courses[0] && enrollment.courses[0].teachersId) {
            const teacherIdFromData = enrollment.courses[0].teachersId.teacherId;
    
            if (teacherIdFromData === teacherId) {
              if (!filteredData[teacherId]) {
                filteredData[teacherId] = {
                  teacherId,
                  courses: new Set(),
                };
              }
    
              enrollment.courses.forEach(course => {
                // Ensure that 'courseId' and 'courseCode' exist
                if (course.courseId && course.courseId.courseCode) {
                  filteredData[teacherId].courses.add(course.courseId.courseCode);
                }
              });
            }
          }
        });
    
        result = Object.values(filteredData).map(teacherData => {
          return {
            teacherId: teacherData.teacherId,
            courses: Array.from(teacherData.courses),
          };
        });
    
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  
    new ResponseGenerator(res, statusCode, result);
  });
  

  exports.addCourseCodeToStudent = catchAsync(async (req, res, next) => {
    let result;
    let statusCode = 201;
    const { studentId, semester } = req.body;
    const student = await Student.findOne({ studentId });
    const course = await Course.find({semester:student.courses_taught.length+1})
    let courseCode = course.map(course => course.courseCode);
    // console.log(courseCode,semester, studentId);
  
    if (!student) {
      return res.status(404).json({ status: 'failed', message: 'Student not found.' });
    } else {
      const courseModels = await Course.find({ courseCode: { $in: courseCode } });
  
      if (!courseModels || courseModels.length !== courseCode.length) {
        return res.status(404).json({ status: 'failed', message: 'One or more courses not found.' });
      }
  
      const semesterIndex = student.courses_taught.findIndex((course) => course.semester === semester);
  
      if (semesterIndex === -1) {
        student.courses_taught.push({
          semester,
          courseCode: courseCode,
          courses: courseModels.map(course => course._id),
        });
      } else {
        courseCode.forEach(code => {
          const isCourseAlreadyAdded = student.courses_taught[semesterIndex].courseCode.includes(code);
  
          if (!isCourseAlreadyAdded) {
            student.courses_taught[semesterIndex].courseCode.push(code);
            const correspondingCourse = courseModels.find(course => course.courseCode === code);
            student.courses_taught[semesterIndex].courses.push(correspondingCourse._id);
          } else {
            statusCode = 400;
            result = { status: 'failed', message: 'One or more courses already added for the specified semester.' };
          }
        });
      }



      // console.log(student.courses_taught)
  
      // await student.save();
      result = { status: 'success', message: 'CourseCodes added to student.' };
    }
  
    new ResponseGenerator(res, statusCode, result);
  });

  exports.removeCourseCodeFromStudent = catchAsync(async (req, res, next) => {
    let result;
    let statusCode = 201;
    const { studentId, semester, courseCode } = req.body;
  
    const student = await Student.findOne({ studentId });
  
    if (!student) {
      return res.status(404).json({ status: 'failed', message: 'Student not found.' });
    }
  
    const courseModels = await Course.find({ courseCode: { $in: courseCode } });
  
    if (!courseModels || courseModels.length !== courseCode.length) {
      return res.status(404).json({ status: 'failed', message: 'One or more courses not found.' });
    }
  
    const semesterIndex = student.courses_taught.findIndex((course) => course.semester === semester);
    if (semesterIndex !== -1) {
      const coursesToRemove = [];
  
      if (courseModels.length > 0) {
        courseCode?.forEach((code) => {
          const courseCodeIndex = student.courses_taught[semesterIndex].courseCode.indexOf(code);
          console.log(courseCodeIndex);
          if (courseCodeIndex !== -1) {
            student.courses_taught[semesterIndex].courseCode.splice(courseCodeIndex, 1);
            student.courses_taught[semesterIndex].courses.splice(courseCodeIndex, 1);
            const correspondingCourse = courseModels.find((course) => course.courseCode === code);
            coursesToRemove.push(correspondingCourse._id);
          } else {
            statusCode = 404;
            result = { status: 'failed', message: 'One or more CourseCodes not found in the specified semester.' };
          }
        });
      }
  
      await student.save();
  
      result = { status: 'success', message: 'CourseCodes removed from student.' };
    } else {
      statusCode = 404;
      result = { status: 'failed', message: 'Semester not found for the student.' };
    }
  
    new ResponseGenerator(res, statusCode, result);
  });
  
  
  