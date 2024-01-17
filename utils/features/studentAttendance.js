

exports.processAttendanceForStudent = (attendanceRecords) => {
    const groupedAttendance = attendanceRecords.reduce((acc, record) => {
      const studentId = record.studentId;
      if (!acc[studentId]) {
        acc[studentId] = {
          studentId,
          studentName: record.studentName,
        };
      }
      acc[studentId][new Date(record.date).toLocaleDateString()] = record.status;
      return acc;
    }, {});
    const processedAttendance = Object.values(groupedAttendance);
  
    return processedAttendance;
  }