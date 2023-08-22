faculty
facultyId
faculty_name:
contact number:
email:
dean:

Department
departmentId:
facultyId:
departmentName:
faculty_name:

Program
programId:
programName:
programType:
programLevel:
programDuration:
departmentId:

Semester
semesterId:
name: Fall-2023, Summer-2023, Spring-2023
startDate:
endDate:

Course
courseId:
programID:
courseCode:
courseName:
credit:
description

[
{
facultyId:
facultyName:
contactNumber:
email:
dean:
department: [
{
departmentId:
departmentName:
departmentTeacher: []
programs:[
{
programId:
programName:
programType:
programLevel:
programDuration:
courses: [
courseId:
courseCode:
courseName:
credit:
description
]
}
]
}
]
}
]

const mongoose = require('mongoose');

// Load your Mongoose schemas for Faculty, Department, Program, and Course
const Course = require('./path-to-your-course-model');
const Program = require('./path-to-your-program-model');
const Department = require('./path-to-your-department-model');
const Faculty = require('./path-to-your-faculty-model');

mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('Connected to the database');

        // Replace 'your-target-course-id' with the actual course ID you want to retrieve
        const targetCourseId = 'your-target-course-id';

        Faculty.findOne({ 'department.programs.courses.courseId': targetCourseId })
            .populate({
                path: 'department.programs.courses',
                match: { courseId: targetCourseId }
            })
            .exec((err, faculty) => {
                if (err) {
                    console.error('Error retrieving course:', err);
                    return;
                }

                if (!faculty) {
                    console.log('Course not found');
                    return;
                }

                const course = faculty.department[0].programs[0].courses[0];
                console.log('Found course:', course);
            });
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });
