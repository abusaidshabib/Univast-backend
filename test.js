function generateSemesterArray(startDate, endDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const semesterSet = new Set();
    
    while (startDateTime <= endDateTime) {
        const year = startDateTime.getFullYear().toString().slice(-2);
        const semesterName = getSemesterNameOnDate(startDateTime);
        
        if (semesterName !== 'Invalid Date') {
            semesterSet.add(`${semesterName}-${year}`);
        }
        
        // Move to the next month
        startDateTime.setMonth(startDateTime.getMonth() + 1);
    }
    
    return Array.from(semesterSet);
}

function getSemesterNameOnDate(date) {
    const month = date.getMonth();
    if (month >= 0 && month <= 2) {
        return 'Spring';
    } else if (month >= 4 && month <= 7) {
        return 'Summer';
    } else if (month >= 8 && month <= 11) {
        return 'Fall';
    } else {
        return 'Invalid Date';
    }
}

// Example usage
const startDate = "2020-01-15";
const endDate = "2021-09-30";
const result = generateSemesterArray(startDate, endDate);
console.log(result);