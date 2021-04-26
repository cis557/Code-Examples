const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Create an express server ;
const app = express();

// Import database
const db = require('./database.js');

const port = 5000;

// GraphQL schema
// Student: the resource we are managing
// Mutation: type for POST and PUT requests
// input: type used as input for Mutations
const schema = buildSchema(`
    input StudentInput {
      name: String
      email: String
      major: String
    },
    type Query {
        student(id: Int!): Student
        students: [Student]
    },
    type Student {
        id: Int!
        name: String
        email: String
        major: String
    },
    type Mutation {
      createStudent(input: StudentInput!): Student
      updateStudent(id: ID!, input: StudentInput!): Student
      deleteStudent(id: ID!): Student
    }
`);

// Student constructor function
function Student(id, { name, email, major }) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.major = major;
}

// Resolver: Get student by id
// Promise-based database query function
function getStudentPromise(args) {
  console.log('READ a student by id');
  const { id } = args;
  const sql = 'select * from student where id = ?';
  const params = [id];
  return new Promise(((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(JSON.stringify({ error: err.message }));
      }
      resolve(row);
    });
  }));
}

// async/await function to retrieve the value of the promise
async function getStudent(args) {
  const row = await getStudentPromise(args).then((value) => value);
  return row;
}

// Resolver: Get all students
// Promise-based database query function
function getStudentsPromise() {
  console.log('READ all students');
  const sql = 'select * from student';
  const result = [];
  return new Promise(((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(JSON.stringify({ error: err.message }));
      }
      rows.forEach((row) => {
        result.push(row);
      });
      resolve(result);
    });
  }));
}

// async/await function to retrieve the value of the promise
async function getStudents() {
  const rows = await getStudentsPromise().then((value) => value);
  return rows;
}

// Resolver: Create a student
function postStudentsPromise(args) {
  console.log('Create a student');
  const sql = 'INSERT INTO student (name, email, major) VALUES (?,?,?)';
  const values = [args.input.name, args.input.email, args.input.major];
  return new Promise(((resolve, reject) => {
    // insert newStudent
    db.run(sql, values, function (err, res) {
      if (err) {
        reject(err.message);
      }
      const stud = new Student(this.lastID, {
        name: args.name,
        email: args.email,
        major: args.major,
      });
      resolve(stud);
    });
  }));
}

// async/await function to retrieve the value of the promise
async function postStudents(args) {
  const stud = await postStudentsPromise(args).then((value) => value);
  return stud;
}

// Resolver: Update a student
function putStudentsPromise(args) {
  console.log('Update a student');
  const sql = 'UPDATE student SET name = ?, email = ?, major =? WHERE id=?';
  const values = [args.input.name, args.input.email, args.input.major, args.id];
  return new Promise(((resolve, reject) => {
    // update newStudent
    db.run(sql, values, (err, res) => {
      if (err) {
        reject(err.message);
      }
      const stud = new Student(args.id, {
        name: args.input.name,
        email: args.input.email,
        major: args.input.major,
      });
      resolve(stud);
    });
  }));
}

// async/await function to retrieve the value of the promise
async function putStudent(args) {
  const stud = await putStudentsPromise(args).then((value) => value);
  return stud;
}

// Resolver: Delete a student
function deleteStudentPromise(args) {
  console.log('Delete a student by id');
  const sql = 'DELETE FROM student where id = ?';
  const { id } = args;
  return new Promise(((resolve, reject) => {
    // delete student
    db.run(sql, id, (err, res) => {
      if (err) {
        reject(err.message);
      }
      resolve(res);
    });
  }));
}

// async/await function to retrieve the value of the promise
async function delStudent(args) {
  // get student first
  const stud = getStudent(args);
  try {
    await deleteStudentPromise(args).then((value) => value);
    return stud;
  } catch (err) {
    throw new Error('could not delete student');
  }
}

// Root type
const root = {
  student: getStudent,
  students: getStudents,
  createStudent: postStudents,
  updateStudent: putStudent,
  deleteStudent: delStudent,
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => console.log(`Express GraphQL Server Now Running On localhost:${port}/graphql`));
