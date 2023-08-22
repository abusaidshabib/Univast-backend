const express = require('express');
const { getFacultyData, editCourse } = require('../controllers/facultyController');
const router = express.Router();


router.route("/").get(getFacultyData).patch(editCourse);

module.exports = router;