const Student = require("../models/studentModel");

exports.createStudentResult = async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await Student.findOne({ studentId });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Assuming req.body contains the result data
      student.results.push(req.body);
      await student.save();

      res.status(201).json({ message: 'Result added successfully', student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };