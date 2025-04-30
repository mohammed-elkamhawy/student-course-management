const readline = require('readline');

// Import CRUD functions
const {
  insertStudent, updateStudent, deleteStudent
} = require('./crud/students');

const {
  insertCourse, updateCourse, deleteCourse
} = require('./crud/courses');

const {
  enrollStudent, updateGrade
} = require('./crud/enrollments');

// Import queries and aggregations
const {
  listStudentsInCourse,
  findTopGPAStudents,
  coursesWithMoreThanTwoStudents,
  coursesForStudent,
  countStudentsPerCourse,
  averageGradePerCourse,
  groupStudentsByMajor
} = require('./queries');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log(`
==============================
 STUDENT COURSE MANAGEMENT
==============================
1. Add a student
2. Update a student
3. Delete a student
4. Add a course
5. Update a course
6. Delete a course
7. Enroll student in course
8. Update student grade
9. List students in a course
10. Find top GPA students
11. List courses with > 2 students
12. Show courses for a student
13. Count students per course
14. Average grade per course
15. Group students by major
0. Exit
------------------------------
  `);

  rl.question('Choose an option: ', async (choice) => {
    try {
      switch (choice.trim()) {
        case '1':
          rl.question('Name Age Major Year (e.g., Ali 21 CS 3): ', async (input) => {
            const [name, age, major, year] = input.split(' ');
            await insertStudent({ name, age: +age, major, year: +year });
            menu();
          });
          break;
        case '2':
          rl.question('StudentID field=value (e.g., 123456 age=22): ', async (input) => {
            const [id, update] = input.split(' ');
            const [field, value] = update.split('=');
            await updateStudent(id, { [field]: isNaN(value) ? value : +value });
            menu();
          });
          break;
        case '3':
          rl.question('StudentID to delete: ', async (id) => {
            await deleteStudent(id.trim());
            menu();
          });
          break;
        case '4':
          rl.question('Title Instructor Credits (e.g., Databases Dr.Noor 3): ', async (input) => {
            const [title, instructor, credits] = input.split(' ');
            await insertCourse({ title, instructor, credits: +credits });
            menu();
          });
          break;
        case '5':
          rl.question('CourseID field=value (e.g., 123456 title=Math): ', async (input) => {
            const [id, update] = input.split(' ');
            const [field, value] = update.split('=');
            await updateCourse(id, { [field]: isNaN(value) ? value : +value });
            menu();
          });
          break;
        case '6':
          rl.question('CourseID to delete: ', async (id) => {
            await deleteCourse(id.trim());
            menu();
          });
          break;
        case '7':
          rl.question('StudentID CourseID Semester Grade: ', async (input) => {
            const [sid, cid, semester, grade] = input.split(' ');
            await enrollStudent(sid, cid, semester, +grade);
            menu();
          });
          break;
        case '8':
          rl.question('StudentID CourseID NewGrade: ', async (input) => {
            const [sid, cid, grade] = input.split(' ');
            await updateGrade(sid, cid, +grade);
            menu();
          });
          break;
        case '9':
          rl.question('Course title: ', async (title) => {
            await listStudentsInCourse(title.trim());
            menu();
          });
          break;
        case '10':
          rl.question('Minimum grade: ', async (min) => {
            await findTopGPAStudents(+min);
            menu();
          });
          break;
        case '11':
          await coursesWithMoreThanTwoStudents();
          menu();
          break;
        case '12':
          rl.question('Student name: ', async (name) => {
            await coursesForStudent(name.trim());
            menu();
          });
          break;
        case '13':
          await countStudentsPerCourse();
          menu();
          break;
        case '14':
          await averageGradePerCourse();
          menu();
          break;
        case '15':
          await groupStudentsByMajor();
          menu();
          break;
        case '0':
          rl.close();
          console.log("Exiting...");
          process.exit(0);
        case 'exit':
          rl.close();
          console.log("Exiting...");
          process.exit(0);
        case 'clear':
          console.clear();
          menu();
          break;
        default:
          console.log("Invalid option. Please choose from 0–15.");
          menu();
      }
    } catch (err) {
      console.error("Error:", err.message);
      menu();
    }
  });
}

menu();
