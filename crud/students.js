const connect = require('../db');
const { ObjectId } = require('mongodb');

async function insertStudent(student) {
  const db = await connect();
  const result = await db.collection('students').insertOne(student);
  console.log('Inserted student:', result.insertedId);
}

async function updateStudent(id, updates) {
  const db = await connect();
  await db.collection('students').updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log('Student updated.');
}

async function deleteStudent(id) {
  const db = await connect();
  await db.collection('students').deleteOne({ _id: new ObjectId(id) });
  await db.collection('enrollments').deleteMany({ student_id: new ObjectId(id) }); // Manual cascade
  console.log('Student and enrollments deleted.');
}

module.exports = { insertStudent, updateStudent, deleteStudent };
