const connect = require('./db');
const { ObjectId } = require('mongodb');

async function seedData() {
  const db = await connect();
  const students = db.collection('students');
  const courses = db.collection('courses');
  const enrollments = db.collection('enrollments');

  // Clear existing data to avoid duplication
  await students.deleteMany({});
  await courses.deleteMany({});
  await enrollments.deleteMany({});

  // Insert students
  const studentDocs = await students.insertMany([
    { name: "Ali", age: 21, major: "CS", year: 3 },
    { name: "Sara", age: 20, major: "IT", year: 2 },
    { name: "Mona", age: 22, major: "IS", year: 4 },
    { name: "Ahmed", age: 23, major: "CS", year: 4 },
    { name: "Khaled", age: 19, major: "IT", year: 1 },
    { name: "Hassan", age: 21, major: "IS", year: 3 },
    { name: "Fatma", age: 20, major: "CS", year: 2 },
    { name: "Omar", age: 22, major: "IT", year: 4 },
    { name: "Yasmin", age: 23, major: "IS", year: 4 },
    { name: "Nour", age: 19, major: "CS", year: 1 },
    { name: "Rami", age: 21, major: "IT", year: 3 },
    { name: "Dina", age: 20, major: "IS", year: 2 },
    { name: "Tamer", age: 22, major: "CS", year: 4 },
    { name: "Laila", age: 23, major: "IT", year: 4 },
    { name: "Samir", age: 19, major: "IS", year: 1 },
    { name: "Hana", age: 21, major: "CS", year: 3 }
  ]);

  // Insert courses
  const courseDocs = await courses.insertMany([
    { title: "Algorithms", instructor: "Dr. Ayman", credits: 3 },
    { title: "Ai", instructor: "Dr. Salma", credits: 2 },
    { title: "Databases", instructor: "Dr. Ebtesam", credits: 3 },
    { title: "Networks", instructor: "Dr. Noor", credits: 3 },
    { title: "Web Development", instructor: "Dr. Hossam", credits: 2 },
    { title: "Software Engineering", instructor: "Dr. Rania", credits: 3 },
    { title: "Operating Systems", instructor: "Dr. Ahmed", credits: 3 },
    { title: "Computer Architecture", instructor: "Dr. Fatma", credits: 3 },
    { title: "Data Structures", instructor: "Dr. Khaled", credits: 2 },
    { title: "Discrete Mathematics", instructor: "Dr. Omar", credits: 3 }
  ]);

  const studentIds = Object.values(studentDocs.insertedIds);
  const courseIds = Object.values(courseDocs.insertedIds);

  // Insert enrollments
  
  await enrollments.insertMany([
    { student_id: studentIds[0], course_id: courseIds[5], semester: "Semester-1", grade: 88 },
    { student_id: studentIds[1], course_id: courseIds[1], semester: "Semester-2", grade: 91 },
    { student_id: studentIds[2], course_id: courseIds[2], semester: "Semester-1", grade: 75 },
    { student_id: studentIds[3], course_id: courseIds[0], semester: "Semester-2", grade: 84 },
    { student_id: studentIds[4], course_id: courseIds[1], semester: "Semester-1", grade: 78 },
    { student_id: studentIds[5], course_id: courseIds[9], semester: "Semester-2", grade: 85 },
    { student_id: studentIds[6], course_id: courseIds[3], semester: "Semester-1", grade: 92 },
    { student_id: studentIds[7], course_id: courseIds[4], semester: "Semester-2", grade: 80 },
    { student_id: studentIds[8], course_id: courseIds[5], semester: "Semester-1", grade: 87 },
    { student_id: studentIds[9], course_id: courseIds[6], semester: "Semester-2", grade: 82 },
    { student_id: studentIds[10], course_id: courseIds[7], semester: "Semester-1", grade: 89 },
    { student_id: studentIds[11], course_id: courseIds[8], semester: "Semester-2", grade: 76 },
    { student_id: studentIds[12], course_id: courseIds[2], semester: "Semester-1", grade: 95 },
    { student_id: studentIds[13], course_id: courseIds[1], semester: "Semester-2", grade: 81 },
    { student_id: studentIds[14], course_id: courseIds[2], semester: "Semester-1", grade: 88 }
  ]);

  console.log("Sample data inserted (without duplication)");
  process.exit();
}

seedData();
