/**
 * Seeds every collection with screenshot-ready demo data.
 * Keeps the 3 login User accounts. Re-run anytime: node scripts/seed-demo-data.js
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "config.env") });

const User = require("../models/userModel");
const Faculty = require("../models/facultyModel");
const Department = require("../models/departmentModel");
const Program = require("../models/programModel");
const Course = require("../models/courseModel");
const Semester = require("../models/semesterModel");
const ALLSemester = require("../models/allSemesterModel");
const Notice = require("../models/noticeModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const Admission = require("../models/admissionModel");
const TeachAdd = require("../models/teachAddModel");
const EnrollCourse = require("../models/courseEnrollModel");
const CourseExtension = require("../models/courseExtensionModel");
const StudentAttendance = require("../models/studentAttendanceModel");
const { Result } = require("../models/resultModel");

const DATA = path.join(__dirname, "..", "data");
const CURRENT = "Spring-2024";
const BLOOD = new Set(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", " ", ""]);

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), "utf8"));
}

function stripMongo(value) {
  if (Array.isArray(value)) return value.map(stripMongo);
  if (value && typeof value === "object") {
    if (Object.prototype.hasOwnProperty.call(value, "$date")) {
      return new Date(value.$date);
    }
    if (Object.prototype.hasOwnProperty.call(value, "$oid")) return undefined;
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === "_id") continue;
      const cleaned = stripMongo(val);
      if (cleaned !== undefined) out[key] = cleaned;
    }
    return out;
  }
  return value;
}

function letter(score) {
  if (score >= 80) return "A+";
  if (score >= 75) return "A";
  if (score >= 70) return "A-";
  if (score >= 65) return "B+";
  if (score >= 60) return "B";
  if (score >= 55) return "B-";
  if (score >= 50) return "C+";
  if (score >= 45) return "C";
  if (score >= 40) return "D";
  return "F";
}

function gpa(score) {
  if (score >= 80) return 4.0;
  if (score >= 75) return 3.75;
  if (score >= 70) return 3.5;
  if (score >= 65) return 3.25;
  if (score >= 60) return 3.0;
  if (score >= 55) return 2.75;
  if (score >= 50) return 2.5;
  if (score >= 45) return 2.25;
  if (score >= 40) return 2.0;
  return 0;
}

function makeResult(semester, course, mid, fin, att, asmt) {
  const total = mid + fin + att + asmt;
  return {
    semester,
    course: course._id,
    courseCode: course.courseCode,
    grade: gpa(total),
    mid: { grade: letter(mid), number: mid },
    final: { grade: letter(fin), number: fin },
    attendance: { grade: letter(att), number: att },
    assessment: { grade: letter(asmt), number: asmt },
  };
}

function taught(semester, courseDocs) {
  return {
    semester,
    courseCode: courseDocs.map((c) => c.courseCode),
    courses: courseDocs.map((c) => c._id),
  };
}

function avatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=256&background=1e3a8a&color=fff`;
}

const extraFaculties = [
  {
    facultyCode: "FAC-104",
    facultyName: "Faculty of Fine & Performing Arts",
    contactNumber: "01711-104000",
    email: "arts.fine@univast.edu",
    dean: "Prof. Nadia Rahman",
  },
  {
    facultyCode: "FAC-105",
    facultyName: "Faculty of Law",
    contactNumber: "01711-105000",
    email: "law@univast.edu",
    dean: "Prof. Tariq Hasan",
  },
  {
    facultyCode: "FAC-106",
    facultyName: "Faculty of Agriculture",
    contactNumber: "01711-106000",
    email: "agri@univast.edu",
    dean: "Prof. Farhana Akter",
  },
  {
    facultyCode: "FAC-107",
    facultyName: "Faculty of Education",
    contactNumber: "01711-107000",
    email: "education@univast.edu",
    dean: "Prof. Imran Kabir",
  },
  {
    facultyCode: "FAC-108",
    facultyName: "Faculty of Business Studies",
    contactNumber: "01711-108000",
    email: "business@univast.edu",
    dean: "Prof. Laila Chowdhury",
  },
  {
    facultyCode: "FAC-109",
    facultyName: "Faculty of Physical Education & Sports",
    contactNumber: "01711-109000",
    email: "sports@univast.edu",
    dean: "Prof. Rashed Khan",
  },
  {
    facultyCode: "FAC-110",
    facultyName: "Faculty of Languages & Humanities",
    contactNumber: "01711-110000",
    email: "languages@univast.edu",
    dean: "Prof. Sadia Noor",
  },
];

const extraPrograms = [
  {
    departmentCode: "DEP-701",
    programCode: "PRO-71101",
    programName: "Bachelor of Elementary Education",
    programType: "Bachelor",
    programLevel: "Undergraduate",
    programDuration: "4 years",
    shifts: ["Day"],
    startDate: "2016-01-01",
  },
  {
    departmentCode: "DEP-702",
    programCode: "PRO-72101",
    programName: "Bachelor of Special Education",
    programType: "Bachelor",
    programLevel: "Undergraduate",
    programDuration: "4 years",
    shifts: ["Day"],
    startDate: "2017-01-01",
  },
  {
    departmentCode: "DEP-901",
    programCode: "PRO-91101",
    programName: "Bachelor of Sports Management",
    programType: "Bachelor",
    programLevel: "Undergraduate",
    programDuration: "4 years",
    shifts: ["Day"],
    startDate: "2018-01-01",
  },
  {
    departmentCode: "DEP-902",
    programCode: "PRO-92101",
    programName: "Bachelor of Physical Education",
    programType: "Bachelor",
    programLevel: "Undergraduate",
    programDuration: "4 years",
    shifts: ["Day", "Evening"],
    startDate: "2018-01-01",
  },
];

const courseCatalog = [
  ["CSE-101", "Introduction to Computer Science", 1, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-102", "Analog Electronics", 1, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-103", "Analog Electronics Laboratory", 1, 1, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-104", "Structured Programming Language", 1, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["MATH-101", "Differential Calculus & Coordinate Geometry", 1, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["ENG-101", "English Composition I", 1, 3, "FAC-110", "DEP-1001", "PRO-101101"],
  ["BUS-101", "Principles of Business Organization", 1, 3, "FAC-108", "DEP-801", "PRO-81101"],
  ["CSE-201", "Data Structures and Algorithms", 2, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-202", "Discrete Mathematics", 2, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-203", "Digital Logic Design", 2, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-204", "Object Oriented Programming", 2, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-301", "Database Management Systems", 3, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-302", "Operating Systems", 3, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-303", "Computer Networks", 3, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-304", "Software Engineering", 3, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-401", "Artificial Intelligence", 4, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["CSE-402", "Compiler Design", 4, 3, "FAC-102", "DEP-201", "PRO-21101"],
  ["AI-101", "Foundations of Artificial Intelligence", 1, 3, "FAC-102", "DEP-202", "PRO-22101"],
  ["AI-201", "Machine Learning Fundamentals", 2, 3, "FAC-102", "DEP-202", "PRO-22102"],
  ["FIN-101", "Principles of Finance", 1, 3, "FAC-108", "DEP-801", "PRO-81101"],
  ["ECO-101", "Principles of Microeconomics", 1, 3, "FAC-108", "DEP-802", "PRO-82101"],
  ["LAW-101", "Introduction to Criminal Law", 1, 3, "FAC-105", "DEP-501", "PRO-51102"],
  ["MED-101", "Human Anatomy I", 1, 4, "FAC-101", "DEP-101", "PRO-11101"],
  ["SUR-101", "Principles of Surgery", 1, 3, "FAC-101", "DEP-102", "PRO-12101"],
];

const universityNotices = [
  {
    title: "Spring 2024 Midterm Examination Schedule",
    content:
      "Midterm examinations will be held from 10 March to 21 March 2024. Students must collect admit cards from the student portal before 8 March. Seating plans will be published on departmental notice boards.",
    date: new Date("2024-02-28"),
    author: "Controller of Examinations",
    targetAudience: "Students",
  },
  {
    title: "Course Registration Deadline — Spring 2024",
    content:
      "Online course registration for Spring 2024 closes on 15 February 2024 at 11:59 PM. Late registration with a fine will remain open until 20 February. Contact your advisor if a course does not appear in the portal.",
    date: new Date("2024-02-05"),
    author: "Office of the Registrar",
    targetAudience: "Students",
  },
  {
    title: "Faculty Development Workshop on Outcome-Based Education",
    content:
      "All faculty members are invited to a two-day OBE workshop on 12–13 February 2024 in the Senate Hall. Attendance is mandatory for course instructors assigned in Spring 2024.",
    date: new Date("2024-02-01"),
    author: "IQAC",
    targetAudience: "Teachers",
  },
  {
    title: "University Closed — International Mother Language Day",
    content:
      "UNIVAST will remain closed on 21 February 2024 in observance of International Mother Language Day. A commemorative program will be held at the Central Shaheed Minar at 8:00 AM.",
    date: new Date("2024-02-18"),
    author: "Office of the Vice Chancellor",
    targetAudience: "All",
  },
  {
    title: "Library Extended Hours During Finals",
    content:
      "The central library will remain open from 8:00 AM to 11:00 PM through the final examination period. Group study rooms can be reserved from the student portal.",
    date: new Date("2024-04-01"),
    author: "Central Library",
    targetAudience: "Students",
  },
  {
    title: "Call for Lecturer Applications — CSE & Business",
    content:
      "The university is hiring lecturers in Computer Science & Engineering and Business Studies. Apply online through Apply for Lecturer. Deadline: 30 April 2024.",
    date: new Date("2024-03-15"),
    author: "Human Resources",
    targetAudience: "Public",
  },
  {
    title: "Convocation 2024 Registration Open",
    content:
      "Graduating students of 2023 and 2024 batches may register for the 8th Convocation. Registration fee is BDT 3,000. Gown collection starts two weeks before the ceremony.",
    date: new Date("2024-05-02"),
    author: "Convocation Cell",
    targetAudience: "Students",
  },
  {
    title: "Campus Wi-Fi Maintenance Window",
    content:
      "Campus-wide Wi-Fi will be upgraded on Friday 8 March 2024 from 1:00 AM to 5:00 AM. Learning platforms may be briefly unavailable during this window.",
    date: new Date("2024-03-04"),
    author: "IT Services",
    targetAudience: "All",
  },
  {
    title: "Scholarship Results — Merit & Need-Based",
    content:
      "Merit and need-based scholarship results for Spring 2024 have been published. Selected students will receive a waiver on the next billing cycle. Appeals close on 20 March 2024.",
    date: new Date("2024-03-08"),
    author: "Student Affairs",
    targetAudience: "Students",
  },
  {
    title: "Guest Lecture: AI in Healthcare",
    content:
      "Department of CSE will host Dr. Ayesha Karim for a guest lecture on Artificial Intelligence in Healthcare on 18 March 2024 at 3:00 PM, Room CSE-501. Open to all students.",
    date: new Date("2024-03-10"),
    author: "Department of CSE",
    targetAudience: "Students",
  },
];

const applicantNames = [
  ["Rafi", "Ahmed", "Male"],
  ["Nusrat", "Jahan", "Female"],
  ["Tanvir", "Islam", "Male"],
  ["Mim", "Akter", "Female"],
  ["Shakib", "Hasan", "Male"],
  ["Fariha", "Sultana", "Female"],
  ["Arif", "Chowdhury", "Male"],
  ["Meherin", "Khan", "Female"],
];

const lecturerApplicants = [
  ["Dr. Kamal", "Hossain", "Male", "DEP-201"],
  ["Sadia", "Rahman", "Female", "DEP-202"],
  ["Mahmud", "Alam", "Male", "DEP-801"],
  ["Nargis", "Ferdous", "Female", "DEP-1001"],
  ["Iftekhar", "Uddin", "Male", "DEP-501"],
];

function address() {
  return {
    present_address: {
      present_country: "Bangladesh",
      present_state_division: "Dhaka",
      present_thana: "Dhanmondi",
      present_city: "Dhaka",
      present_zip_code: "1209",
      present_street1: "House 12, Road 7, Dhanmondi",
      present_street2: "Dhaka",
    },
    permanent_address: {
      permanent_country: "Bangladesh",
      permanent_state_division: "Dhaka",
      present_thana: "Jatrabari",
      permanent_thana: "Jatrabari",
      permanent_city: "Dhaka",
      permanent_zip_code: "1236",
      permanent_street1: "West Matuail, Jatrabari",
      permanent_street2: "Dhaka",
    },
  };
}

function family(lastName) {
  return {
    father: {
      father_name: `Abdul ${lastName}`,
      father_mobile: "01711112233",
      father_email: `father.${lastName.toLowerCase()}@gmail.com`,
      father_nid: "1970123456789",
      father_passport: "A01234567",
      father_dob: new Date("1970-03-12"),
      father_age: 55,
      father_occupation: "Business",
      father_company: "Self Employed",
      father_designation: "Proprietor",
      father_income: 80000,
    },
    mother: {
      mother_name: `Rokeya ${lastName}`,
      mother_mobile: "01811112233",
      mother_email: `mother.${lastName.toLowerCase()}@gmail.com`,
      mother_nid: "1975123456789",
      mother_passport: "A07654321",
      mother_dob: new Date("1975-08-20"),
      mother_age: 50,
      mother_occupation: "Homemaker",
      mother_company: "",
      mother_designation: "",
      mother_income: 0,
    },
  };
}

function educationBlock() {
  return [
    {
      exam: "SSC",
      institution_name: "Dhaka Residential Model College",
      board: "Dhaka",
      group_major: "Science",
      result: 5,
      passing_year: 2018,
      certificates: "",
    },
    {
      exam: "HSC",
      institution_name: "Notre Dame College",
      board: "Dhaka",
      group_major: "Science",
      result: 5,
      passing_year: 2020,
      certificates: "",
    },
  ];
}

async function resetCollections() {
  await Promise.all([
    Faculty.deleteMany({}),
    Department.deleteMany({}),
    Program.deleteMany({}),
    Course.deleteMany({}),
    Semester.deleteMany({}),
    ALLSemester.deleteMany({}),
    Notice.deleteMany({}),
    Teacher.deleteMany({}),
    Student.deleteMany({}),
    Admission.deleteMany({}),
    TeachAdd.deleteMany({}),
    EnrollCourse.deleteMany({}),
    CourseExtension.deleteMany({}),
    StudentAttendance.deleteMany({}),
    Result.deleteMany({}),
  ]);
}

(async () => {
  await mongoose.connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 25000,
  });
  console.log("MongoDB connected");

  const demoUsers = await User.find({
    email: {
      $in: [
        "univastadmin@gmail.com",
        "mdpulokhasan@gmail.com",
        "pobonsaha001@gmail.com",
      ],
    },
  });
  console.log(`Keeping ${demoUsers.length} login users`);

  await resetCollections();
  console.log("Cleared collections");

  const faculties = [...readJson("faculty.json"), ...extraFaculties];
  await Faculty.insertMany(faculties);

  const departments = readJson("department.json");
  await Department.insertMany(departments);

  const programs = [...readJson("programs.json"), ...extraPrograms];
  await Program.insertMany(programs);

  const courses = await Course.insertMany(
    courseCatalog.map(([courseCode, courseName, semester, credit, facultyCode, departmentCode, programCode]) => ({
      courseCode,
      courseName,
      semester,
      credit,
      facultyCode,
      departmentCode,
      programCode,
    }))
  );
  const byCode = Object.fromEntries(courses.map((c) => [c.courseCode, c]));

  await Semester.insertMany([
    {
      semesterName: "Spring",
      semesterType: "Tri-Semester",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-04-30"),
    },
    {
      semesterName: "Summer",
      semesterType: "Tri-Semester",
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-08-31"),
    },
    {
      semesterName: "Fall",
      semesterType: "Tri-Semester",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-12-31"),
    },
  ]);

  const semesterNames = [
    "Spring-2024",
    "Summer-2024",
    "Fall-2024",
    "Spring-2025",
    "Summer-2025",
    "Fall-2025",
    "Spring-2026",
    "Summer-2026",
  ];
  await ALLSemester.insertMany(
    departments.map((d) => ({
      departmentCode: d.departmentCode,
      semesterName: semesterNames,
    }))
  );

  await Notice.insertMany(universityNotices);

  const teachersRaw = stripMongo(readJson("teachers.json"));
  const springCourses = ["CSE-101", "CSE-102", "CSE-103", "CSE-104", "MATH-101"].map(
    (code) => byCode[code]
  );
  const summerCourses = ["CSE-201", "CSE-202", "CSE-203"].map((code) => byCode[code]);
  const fallCourses = ["CSE-301", "CSE-302", "CSE-304"].map((code) => byCode[code]);

  const teachers = teachersRaw.map((t) => {
    const name = `${t.personal.firstName} ${t.personal.lastName}`;
    t.personal.image = avatar(name);
    t.personal.signature = avatar(name);
    if (t.personal.email === "pobonsaha001@gmail.com") {
      t.personal.firstName = "Pobon";
      t.personal.lastName = "Saha";
      t.facultyCode = "FAC-102";
      t.departmentCode = "DEP-201";
      t.departmentName = "Computer Science & Engineering";
      t.designation = "Assistant Professor";
      t.research_interests = [
        "Machine Learning",
        "Computer Vision",
        "Educational Data Mining",
      ];
      t.courses_taught = [
        taught(CURRENT, [byCode["CSE-101"], byCode["CSE-104"], byCode["CSE-201"]]),
        taught("Summer-2024", [byCode["CSE-202"], byCode["CSE-203"]]),
        taught("Fall-2024", [byCode["CSE-301"], byCode["CSE-302"]]),
      ];
    }
    return t;
  });
  await Teacher.insertMany(teachers);
  const pobon = await Teacher.findOne({ "personal.email": "pobonsaha001@gmail.com" });

  const otherTeachers = await Teacher.find({
    "personal.email": { $ne: "pobonsaha001@gmail.com" },
  });
  const leftover = [
    byCode["ENG-101"],
    byCode["BUS-101"],
    byCode["AI-101"],
    byCode["FIN-101"],
    byCode["ECO-101"],
    byCode["LAW-101"],
    byCode["MED-101"],
    byCode["SUR-101"],
    byCode["CSE-303"],
    byCode["CSE-401"],
  ];
  for (let i = 0; i < otherTeachers.length && i < leftover.length; i++) {
    otherTeachers[i].courses_taught = [taught(CURRENT, [leftover[i]])];
    await otherTeachers[i].save();
  }

  const cseStudents = readJson("newStudent.json").slice(0, 70);
  const deptByCode = Object.fromEntries(departments.map((d) => [d.departmentCode, d]));

  const studentDocs = cseStudents.map((raw, index) => {
    const program = programs[index % programs.length];
    const dept = deptByCode[program.departmentCode];
    const blood = BLOOD.has(raw.personal?.blood_group) ? raw.personal.blood_group : "O+";
    const nid = String(raw.personal?.nid_Birth_certificate || 1000000000000 + index);
    const enrolledCse = program.programCode === "PRO-21101" || index < 18;

    const spring = enrolledCse ? springCourses : [leftover[index % leftover.length]];
    const summer = enrolledCse ? summerCourses : [];
    const fall = enrolledCse ? fallCourses : [];

    const coursesTaught = [taught(CURRENT, spring)];
    if (summer.length) coursesTaught.push(taught("Summer-2024", summer));
    if (fall.length) coursesTaught.push(taught("Fall-2024", fall));

    const results = [];
    for (const c of spring) {
      results.push(
        makeResult(
          CURRENT,
          c,
          18 + (index % 7),
          32 + (index % 10),
          8 + (index % 3),
          9 + (index % 2)
        )
      );
    }
    for (const c of summer) {
      results.push(
        makeResult("Summer-2024", c, 16 + (index % 6), 30 + (index % 8), 8, 8)
      );
    }

    return {
      studentId: 20240001 + index + 1,
      facultyCode: dept?.facultyCode || "FAC-102",
      departmentCode: program.departmentCode,
      programCode: program.programCode,
      programName: program.programName,
      batch: 2024,
      admission_date: new Date("2024-01-15"),
      general: {
        program_type: program.programType || "Bachelor",
        last_complete_degree_type: "HSC",
        medium: "English",
        education_shift: (program.shifts && program.shifts[0]) || "Day",
      },
      personal: {
        ...raw.personal,
        blood_group: blood,
        nid_Birth_certificate: nid,
        nationality: raw.personal?.nationality || "Bangladeshi",
        country: raw.personal?.country || "Bangladesh",
        image: avatar(`${raw.personal?.firstName || "Student"} ${raw.personal?.lastName || index}`),
        signature: avatar("Signature"),
      },
      family: raw.family,
      education: raw.education,
      others: raw.others,
      courses_taught: coursesTaught,
      results,
    };
  });

  const demoResults = [];
  for (const c of springCourses) {
    demoResults.push(makeResult(CURRENT, c, 22, 38, 10, 10));
  }
  for (const c of summerCourses) {
    demoResults.push(makeResult("Summer-2024", c, 20, 35, 9, 9));
  }
  for (const c of fallCourses) {
    demoResults.push(makeResult("Fall-2024", c, 21, 36, 10, 8));
  }

  studentDocs.unshift({
    studentId: 20242011,
    facultyCode: "FAC-102",
    departmentCode: "DEP-201",
    programCode: "PRO-21101",
    programName: "Bachelor of Computer Science",
    batch: 2024,
    admission_date: new Date("2024-01-12"),
    general: {
      program_type: "Bachelor",
      last_complete_degree_type: "HSC",
      medium: "English",
      education_shift: "Day",
    },
    personal: {
      firstName: "Pulok",
      lastName: "Hasan",
      gender: "Male",
      birth_date: "1999-11-04",
      religion: "Islam",
      marital: "Single",
      blood_group: "B+",
      email: "mdpulokhasan@gmail.com",
      mobile: "01712345678",
      nid_Birth_certificate: "1999110412345",
      passport: "EH0123456",
      nationality: "Bangladeshi",
      country: "Bangladesh",
      social_media: "https://linkedin.com/in/pulokhasan",
      image: avatar("Pulok Hasan"),
      signature: avatar("Pulok Hasan"),
      address: address(),
    },
    family: family("Hasan"),
    education: educationBlock(),
    others: {
      is_parents_freedom_fighter: false,
      is_tribal: false,
      is_physical_disorder: false,
      is_first_division_player: false,
      accept_declaration: true,
      accept_terms: true,
    },
    courses_taught: [
      taught(CURRENT, springCourses),
      taught("Summer-2024", summerCourses),
      taught("Fall-2024", fallCourses),
    ],
    results: demoResults,
  });

  await Student.insertMany(studentDocs, { ordered: false });
  const pulok = await Student.findOne({ "personal.email": "mdpulokhasan@gmail.com" });
  const enrolled = await Student.find({
    "courses_taught.courseCode": "CSE-101",
  }).limit(25);

  const enrollCourses = [
    { courseId: byCode["CSE-101"]._id, teachersId: pobon._id },
    { courseId: byCode["CSE-104"]._id, teachersId: pobon._id },
    { courseId: byCode["CSE-201"]._id, teachersId: pobon._id },
    { courseId: byCode["CSE-102"]._id, teachersId: otherTeachers[0]?._id },
    { courseId: byCode["CSE-103"]._id, teachersId: otherTeachers[1]?._id },
  ].filter((row) => row.teachersId);

  await EnrollCourse.insertMany([
    { semester: CURRENT, courses: enrollCourses },
    {
      semester: "Summer-2024",
      courses: [
        { courseId: byCode["CSE-202"]._id, teachersId: pobon._id },
        { courseId: byCode["CSE-203"]._id, teachersId: pobon._id },
      ],
    },
    {
      semester: "Fall-2024",
      courses: [
        { courseId: byCode["CSE-301"]._id, teachersId: pobon._id },
        { courseId: byCode["CSE-302"]._id, teachersId: pobon._id },
      ],
    },
  ]);

  const contentCourses = [
    "CSE-101",
    "CSE-102",
    "CSE-103",
    "CSE-104",
    "MATH-101",
    "CSE-201",
    "CSE-202",
    "CSE-301",
  ];
  const extensions = [];
  for (const code of contentCourses) {
    const course = byCode[code];
    const semestersForCourse = [CURRENT];
    if (["CSE-201", "CSE-202"].includes(code)) semestersForCourse.push("Summer-2024");
    if (["CSE-301"].includes(code)) semestersForCourse.push("Fall-2024");
    for (const semester of semestersForCourse) {
      extensions.push({
        semester,
        courseId: course._id,
        outline: [
          {
            title: `${code} Course Outline`,
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        ],
        lectures: [
          {
            title: `Lecture 01 — Introduction to ${code}`,
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            title: `Lecture 02 — Core Concepts`,
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            title: `Lecture 03 — Problem Solving`,
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        ],
        classwork: [
          {
            title: "Assignment 1",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            title: "Lab Report 1",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        ],
        notice: [
          {
            title: `${code} class cancelled on 21 Feb (Language Day)`,
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
          {
            title: "Quiz 1 next week — chapters 1–3",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          },
        ],
      });
    }
  }
  await CourseExtension.insertMany(extensions);

  const classDates = [
    "2024-02-04",
    "2024-02-06",
    "2024-02-11",
    "2024-02-13",
    "2024-02-18",
    "2024-02-20",
    "2024-02-25",
    "2024-02-27",
    "2024-03-03",
    "2024-03-05",
  ];
  const attendanceRows = [];
  for (const student of enrolled) {
    for (const code of ["CSE-101", "CSE-104"]) {
      classDates.forEach((iso, i) => {
        attendanceRows.push({
          semester: CURRENT,
          student: student._id,
          course: byCode[code]._id,
          date: new Date(iso),
          status: (student.studentId + i) % 5 !== 0,
        });
      });
    }
  }
  if (pulok) {
    for (const code of ["CSE-101", "CSE-102", "CSE-103", "CSE-104", "MATH-101"]) {
      classDates.forEach((iso, i) => {
        attendanceRows.push({
          semester: CURRENT,
          student: pulok._id,
          course: byCode[code]._id,
          date: new Date(iso),
          status: i !== 2 && i !== 7,
        });
      });
    }
  }
  await StudentAttendance.insertMany(attendanceRows);

  await Result.insertMany(demoResults);

  const admissionDocs = applicantNames.map(([firstName, lastName, gender], i) => {
    const program = programs[i];
    return {
      general: {
        applicant_type: "Local",
        program_type: program.programType,
        last_complete_degree_type: "HSC",
        programCode: program.programCode,
        programName: program.programName,
        medium: "English",
        education_shift: "Day",
        admission_test_venue: "Main Campus",
        admission_semester: CURRENT,
      },
      personal: {
        firstName,
        lastName,
        gender,
        birth_date: "2004-05-15",
        religion: "Islam",
        marital: "Single",
        blood_group: ["A+", "B+", "O+", "AB+"][i % 4],
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@applicant.com`,
        mobile: `0161${(1000000 + i).toString().slice(-7)}`,
        nid_Birth_certificate: `20040515${(1000 + i).toString()}`,
        passport: "",
        nationality: "Bangladeshi",
        country: "Bangladesh",
        social_media: "",
        image: avatar(`${firstName} ${lastName}`),
        signature: avatar(firstName),
        address: address(),
      },
      family: family(lastName),
      education: educationBlock().map((e) => ({ ...e, result: String(e.result) })),
      others: {
        is_parents_freedom_fighter: i === 0,
        is_tribal: false,
        is_physical_disorder: false,
        is_first_division_player: i === 3,
        accept_declaration: true,
        accept_terms: true,
      },
      firebaseId: `seed-admission-${i + 1}`,
    };
  });
  await Admission.insertMany(admissionDocs);

  const teachAddDocs = lecturerApplicants.map(([firstName, lastName, gender, departmentCode], i) => ({
    personal: {
      firstName,
      lastName,
      gender,
      birth_date: "1990-06-12",
      religion: "Islam",
      marital: i % 2 === 0 ? "Married" : "Single",
      blood_group: "O+",
      father_name: `Mr. ${lastName}`,
      mother_name: `Mrs. ${lastName}`,
      email: `${firstName.replace(/\s+/g, ".").toLowerCase()}.${lastName.toLowerCase()}@lecturer.app`,
      mobile: `0151${(2000000 + i).toString().slice(-7)}`,
      nid_Birth_certificate: `19900612${(2000 + i).toString()}`,
      passport: "",
      nationality: "Bangladeshi",
      country: "Bangladesh",
      social_media: "",
      image: avatar(`${firstName} ${lastName}`),
      signature: avatar(firstName),
      address: address(),
    },
    experience: [
      {
        institution_name: "Daffodil International University",
        designation: "Lecturer",
        location: "Dhaka",
        startDate: "2019-01-01",
        endDate: "2023-12-31",
        currentlyWorking: false,
      },
    ],
    education: [
      {
        exam: "BSc",
        institution_name: "BUET",
        board: "Dhaka",
        group_major: "Science",
        result: 3.75,
        passing_year: 2014,
        certificates: "",
      },
      {
        exam: "MSc",
        institution_name: "University of Dhaka",
        board: "Dhaka",
        group_major: "Science",
        result: 3.9,
        passing_year: 2016,
        certificates: "",
      },
    ],
    departmentCode,
    courses_taught: [
      {
        course_code: "CSE-101",
        course_name: "Introduction to Computer Science",
        semester: CURRENT,
        total_Student: 40,
        class_schedule: { days: ["Sunday", "Tuesday"], time: "09:00 AM" },
      },
    ],
    research_interests: ["Machine Learning", "Data Mining"],
    publication: [
      {
        title: "A Study on Undergraduate Learning Analytics",
        author: [`${firstName} ${lastName}`],
        publication_year: "2023",
        journal: "IEEE Access",
        volume: 11,
        pages: "120-134",
        doi: `10.1109/ACCESS.2023.${1000 + i}`,
      },
    ],
    others: {
      is_parents_freedom_fighter: false,
      is_tribal: false,
      is_physical_disorder: false,
      is_first_division_player: false,
      accept_declaration: true,
      accept_terms: true,
    },
  }));
  await TeachAdd.insertMany(teachAddDocs);

  const counts = {
    users: await User.countDocuments(),
    faculties: await Faculty.countDocuments(),
    departments: await Department.countDocuments(),
    programs: await Program.countDocuments(),
    courses: await Course.countDocuments(),
    semesters: await Semester.countDocuments(),
    allSemesters: await ALLSemester.countDocuments(),
    notices: await Notice.countDocuments(),
    teachers: await Teacher.countDocuments(),
    students: await Student.countDocuments(),
    admissions: await Admission.countDocuments(),
    lecturerApplications: await TeachAdd.countDocuments(),
    enrollments: await EnrollCourse.countDocuments(),
    courseContent: await CourseExtension.countDocuments(),
    attendance: await StudentAttendance.countDocuments(),
    results: await Result.countDocuments(),
  };
  console.log("Seed complete:");
  console.log(counts);

  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
