const connect = require('./db');
const { ObjectId } = require('mongodb');

// === STUDENT FUNCTIONS ===
async function insertStudent(student) {
  const db = await connect();
  const result = await db.collection('students').insertOne(student);
  console.log("Student added:", result.insertedId);
}

async function updateStudent(id, updates) {
  const db = await connect();
  delete updates._id;
  await db.collection('students').updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log("Student updated.");
}

async function deleteStudent(id) {
  const db = await connect();
  await db.collection('students').deleteOne({ _id: new ObjectId(id) });
  await db.collection('enrollments').deleteMany({ student_id: new ObjectId(id) });
  console.log("Student and enrollments deleted.");
}

// === COURSE FUNCTIONS ===
async function insertCourse(course) {
  const db = await connect();
  const result = await db.collection('courses').insertOne(course);
  console.log("Course added:", result.insertedId);
}

async function updateCourse(id, updates) {
  const db = await connect();
  delete updates._id;
  await db.collection('courses').updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log("Course updated.");
}

async function deleteCourse(id) {
  const db = await connect();
  await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
  console.log("Course deleted.");
}

// === ENROLLMENTS ===
async function enrollStudent(studentId, courseId, semester, grade) {
  const db = await connect();
  await db.collection('enrollments').insertOne({
    student_id: new ObjectId(studentId),
    course_id: new ObjectId(courseId),
    semester,
    grade
  });
  console.log("Student enrolled.");
}

async function updateGrade(studentId, courseId, grade) {
  const db = await connect();
  await db.collection('enrollments').updateOne(
    { student_id: new ObjectId(studentId), course_id: new ObjectId(courseId) },
    { $set: { grade } }
  );
  console.log("Grade updated.");
}

// === QUERIES & AGGREGATIONS ===
async function listStudentsInCourse(courseTitle) {
  const db = await connect();
  const course = await db.collection('courses').findOne({ title: courseTitle });
  if (!course) return console.log("Course not found");

  const enrollments = await db.collection('enrollments').find({ course_id: course._id }).toArray();
  const studentIds = enrollments.map(e => e.student_id);
  const students = await db.collection('students').find({ _id: { $in: studentIds } }).toArray();

  console.log(`Students in "${courseTitle}":`);
  students.forEach(s => console.log(`- ${s.name} (${s.major})`));
}

async function findTopGPAStudents(minGrade) {
  const db = await connect();
  const results = await db.collection('enrollments').aggregate([
    { $match: { grade: { $gte: minGrade } } },
    {
      $lookup: {
        from: 'students',
        localField: 'student_id',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    { $project: { name: '$student.name', grade: 1 } }
  ]).toArray();

  console.log(`Students with grade >= ${minGrade}:`);
  results.forEach(s => console.log(`- ${s.name}: ${s.grade}`));
}

async function coursesWithMoreThanTwoStudents() {
  const db = await connect();
  const result = await db.collection('enrollments').aggregate([
    { $group: { _id: '$course_id', studentCount: { $sum: 1 } } },
    { $match: { studentCount: { $gt: 2 } } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    { $project: { title: '$course.title', studentCount: 1 } }
  ]).toArray();

  console.log("Courses with > 2 students:");
  result.forEach(c => console.log(`- ${c.title}: ${c.studentCount} students`));
}

async function coursesForStudent(studentName) {
  const db = await connect();
  const student = await db.collection('students').findOne({ name: studentName });
  if (!student) return console.log("Student not found");

  const enrollments = await db.collection('enrollments').find({ student_id: student._id }).toArray();
  const courseIds = enrollments.map(e => e.course_id);
  const courses = await db.collection('courses').find({ _id: { $in: courseIds } }).toArray();

  console.log(`Courses for ${studentName}:`);
  courses.forEach(c => console.log(`- ${c.title}`));
}

async function countStudentsPerCourse() {
  const db = await connect();
  const result = await db.collection('enrollments').aggregate([
    { $group: { _id: '$course_id', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    { $project: { course: '$course.title', count: 1 } }
  ]).toArray();

  console.log("Student count per course:");
  result.forEach(c => console.log(`- ${c.course}: ${c.count}`));
}

async function averageGradePerCourse() {
  const db = await connect();
  const result = await db.collection('enrollments').aggregate([
    { $group: { _id: '$course_id', avgGrade: { $avg: '$grade' } } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    { $project: { course: '$course.title', avgGrade: 1 } }
  ]).toArray();

  console.log("Average grade per course:");
  result.forEach(c => console.log(`- ${c.course}: ${c.avgGrade.toFixed(2)}`));
}

async function groupStudentsByMajor() {
  const db = await connect();
  const result = await db.collection('students').aggregate([
    { $group: { _id: '$major', count: { $sum: 1 } } }
  ]).toArray();

  console.log("Students grouped by major:");
  result.forEach(g => console.log(`- ${g._id}: ${g.count}`));
}

// EXIT FUNCTION
async function exit() {
  const db = await connect();
  await db.close();
  console.log("Connection closed.");
}

// === EXPORT EVERYTHING ===
module.exports = {
  insertStudent,
  updateStudent,
  deleteStudent,
  insertCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  updateGrade,
  listStudentsInCourse,
  findTopGPAStudents,
  coursesWithMoreThanTwoStudents,
  coursesForStudent,
  countStudentsPerCourse,
  averageGradePerCourse,
  groupStudentsByMajor,
    exit
};
