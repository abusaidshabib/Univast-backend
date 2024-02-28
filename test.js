// Sample arrays of student data
const firstArray = [
    {
      general: {
        // ... (other properties)
      },
      personal: {
        firstName: 'Md Golam',
        lastName: 'Mehedi',
        // ... (other properties)
      },
      // ... (other properties)
      studentId: 20241012,
      // ... (other properties)
    }
  ];
  
  const secondArray = [
    { studentId: 101, name: 'John' },
    { studentId: 103, name: 'Alice' },
  ];
  firstArray.forEach((student) => {
    const found = secondArray.some((existingStudent) => existingStudent.studentId === student.studentId);
    if (!found) {
      const name = `${student.personal.firstName} ${student.personal.lastName}`;
      secondArray.push({ studentId: student.studentId, name });
    }
  });
  console.log(secondArray);
  

  // writeout