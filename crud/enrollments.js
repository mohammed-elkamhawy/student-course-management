const connect = require('../db');
const { ObjectId } = require('mongodb');

async function enrollStudent(studentId, courseId, semester, grade) {
  const db = await connect();
  await db.collection('enrollments').insertOne({
    student_id: new ObjectId(studentId),
    course_id: new ObjectId(courseId),
    semester,
    grade
  });
  console.log('Student enrolled.');
}

async function updateGrade(studentId, courseId, newGrade) {
  const db = await connect();
  await db.collection('enrollments').updateOne(
    { student_id: new ObjectId(studentId), course_id: new ObjectId(courseId) },
    { $set: { grade: newGrade } }
  );
  console.log('Grade updated.');
}

module.exports = { enrollStudent, updateGrade };
