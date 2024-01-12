exports.getSemesterNameOnDate = (startDate, endDate) => {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const semesterSet = new Set();
    
    while (startDateTime <= endDateTime) {
        const year = startDateTime.getFullYear().toString();
        const semesterName = getSemesterNameOnDate(startDateTime);
        
        if (semesterName !== 'Invalid Date') {
            semesterSet.add(`${semesterName}-${year}`);
        }
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