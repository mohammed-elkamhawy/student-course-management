const connect = require('../db');
const { ObjectId } = require('mongodb');

async function insertCourse(course) {
  const db = await connect();
  const result = await db.collection('courses').insertOne(course);
  console.log('Inserted course:', result.insertedId);
}

async function updateCourse(id, updates) {
  const db = await connect();
  await db.collection('courses').updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log('Course updated.');
}

async function deleteCourse(id) {
  const db = await connect();
  await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
  console.log('Course deleted.');
}

module.exports = { insertCourse, updateCourse, deleteCourse };
