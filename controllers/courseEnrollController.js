const mongoose = require('mongoose');
const EnrollCourse = require("../models/courseEnrollModel");
const AppError = require("../utils/AppError");
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
    const semester = req.query.semester;
  
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
  
    new ResponseGenerator(res, statusCode, result);
  });
  

  exports.addCourseCodeToStudent = catchAsync(async (req, res, next) => {
    let result;
    let statusCode = 201;
    const { studentId, semester, courseCode } = req.body;
  
    const student = await Student.findOne({ studentId });
  
    if (!student) {
      return res.status(404).json({ status: 'failed', message: 'Student not found.' });
    } else {
      const courseModel = await Course.findOne({ courseCode });
  
      if (!courseModel) {
        return res.status(404).json({ status: 'failed', message: 'Course not found.' });
      }
      if (!student.courses_taught) {
        student.courses_taught = [];
      }
  
      const semesterIndex = student.courses_taught.findIndex((course) => course.semester === semester);
  
      if (semesterIndex === -1) {
        student.courses_taught.push({
          semester,
          courseCode: [courseCode],
          courses: [courseModel._id],
        });
      } else {
        const isCourseAlreadyAdded = student.courses_taught[semesterIndex].courseCode.includes(courseCode);
  
        if (!isCourseAlreadyAdded) {
          student.courses_taught[semesterIndex].courseCode.push(courseCode);
          student.courses_taught[semesterIndex].courses.push(courseModel._id);
        } else {
          statusCode = 400;
          result = { status: 'failed', message: 'Course already added for the specified semester.' };
        }
      }
  
      await student.save();
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
    } else {
      const courseModel = await Course.findOne({ courseCode });
  
      if (!courseModel) {
        return res.status(404).json({ status: 'failed', message: 'Course not found.' });
      }
  
      // Initialize courses_taught array if undefined
      if (!student.courses_taught) {
        student.courses_taught = [];
      }
  
      const semesterIndex = student.courses_taught.findIndex((course) => course.semester === semester);
  
      if (semesterIndex !== -1) {
        const courseCodeIndex = student.courses_taught[semesterIndex].courseCode.indexOf(courseCode);
  
        if (courseCodeIndex !== -1) {
          student.courses_taught[semesterIndex].courseCode.splice(courseCodeIndex, 1);
          student.courses_taught[semesterIndex].courses.splice(courseCodeIndex, 1);
          await student.save();
          result = { status: 'success', message: 'CourseCode removed from student.' };
        } else {
          statusCode = 404;
          result = { status: 'failed', message: 'CourseCode not found in the specified semester.' };
        }
      } else {
        statusCode = 404;
        result = { status: 'failed', message: 'Semester not found for the student.' };
      }
    }
  
    new ResponseGenerator(res, statusCode, result);
  });
  
  