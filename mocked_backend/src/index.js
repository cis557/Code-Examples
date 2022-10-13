/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// import API functions
import { getStudents, getStudent, createStudent } from './api/mock_api';

/**
 * NameCell pure component
 * @param {*} props - an object {name, major, email} representing the student to display
 * @returns NameCell elements
 */
function NameCell(props) {
  // const url = `/#`;
  return (
    <td>
      <div
        style={{ textDecoration: 'underline', cursor: 'pointer' }}
        key={props.student.id}
        onClick={async () => {
          const student = await getStudent(props.student.id);
          alert(JSON.stringify(student));
        // do not use 'alert' in production
        }}
      >
        {props.student.name}

      </div>
    </td>
  );
}
/**
 * StudentRow pure component
 * @param {*} props - an object {name, major, email} representing the student to display
 * @returns StudentRow elements
 */
function StudentRow(props) {
  return (
    <tr>
      <NameCell student={props.student} />
      <td>{props.student.email}</td>
      <td>{props.student.major}</td>
    </tr>
  );
}

/**
 * StudentTable component
 * @returns StudentTable elements
 */
function StudentTable(props) {
  // counter to provide unique key to rows
  const counter = useRef(0);
  let studentsList = [];
  let majorFilter = 'SHOW_ALL';
  // get the list of student and the major from props
  if (props.major) {
    majorFilter = props.major;
  }
  studentsList = props.students;
  const makeRows = () => {
    const rows = [];
    studentsList.forEach((element) => {
      // const { student } = element;
      if (majorFilter === 'SHOW_ALL') {
        rows.push(
          <StudentRow
            student={element}
            key={counter.current}
          />,
        );
      } else {
        if (!element.major.startsWith(majorFilter)) {
          return;
        }
        rows.push(
          <StudentRow
            student={element}
            key={counter.current}
          />,
        );
      }
      // increment counter
      counter.current += 1;
    });
    return rows;
  };

  const rows = makeRows();

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Major</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
/**
 * SearchBar component
 * pass the major entered as props to its children
 * @returns SearchBar elements
 */
function SearchBar(props) {
  const [major, setMajor] = useState('');
  const handleFilterTextChange = (e) => {
    setMajor(e.target.value);
  };

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Search by major..."
          onChange={handleFilterTextChange}
        />
      </form>
      <StudentTable major={major} students={props.roster} />
    </div>
  );
}
/**
 * FilterableStudentsTable component
 * This component fetched the list of students from the
 * backend and pass it as props to its child
 * @returns FilterableStudentsTable elements
 */
function FilterableStudentsTable(props) {
  // local state to store and update the list of students
  const [roster, setRoster] = useState([]);
  // ref to indicate if this is the first rendering
  const firstRendering = useRef(true);
  // get the list of students from the backend
  useEffect(() => {
    // get the list of students from the backend
    async function fetchData() {
      const data = await getStudents();
      setRoster(data);
    }
    // only load data on the first rendering or
    // when a new student is created
    if (firstRendering.current || props.reload.current) {
      firstRendering.current = false;
      props.reload.current = false; // set reload to false
      fetchData();
    }
  });

  return (
    <SearchBar roster={roster} />
  );
}
/**
 * AddStudent component
 * @returns AddStudent elements
 */
function AddStudent() {
  // local state new student data
  // we do not need the state variable since we are
  // not passing it as prop. Its child will get the
  // list of students from the backend
  const [, setNewStudent] = useState(null);

  // Ref variable to tell theFilterableStudentsTable
  // to load data  or not
  const loadData = useRef(false);
  // new student fields
  let newName;
  let newEmail;
  let newMajor;

  const handleOnChange = (e) => {
    // update fields inside event handlers
    if (e.target.name === 'email') {
      newName = e.target.value;
    }
    if (e.target.name === 'email') {
      newEmail = e.target.value;
    }
    if (e.target.name === 'major') {
      newMajor = e.target.value;
    }
  };

  const handleCreateStudent = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    // create new student variable
    const newStudent = { name: newName, email: newEmail, major: newMajor };
    // clear the form
    const form = document.getElementById('info');
    form.reset();
    // send POST request to create the student
    const newStoredStudent = await createStudent(newStudent);
    // update loadData
    loadData.current = true;
    // newStoredStudent has an id
    // then update state to trigger rerendering and load
    // the list of student (FilterableStudentsTable) from
    // backend
    setNewStudent(newStoredStudent);
  };

  return (
    <div>
      {' '}
      <FilterableStudentsTable reload={loadData} />
      <form id="info" onSubmit={handleCreateStudent}>
        <input
          type="text"
          name="name"
          placeholder="Name..."
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="email"
          placeholder="email..."
          onChange={handleOnChange}
        />
        <input
          type="text"
          name="major"
          placeholder="major..."
          onChange={handleOnChange}
        />
        <button type="submit">Create Student</button>
      </form>
    </div>
  );
}
/**
 * Login component
 * @returns Login elements
 */
function LoginComponent() {
  const [connected, setConnected] = useState(false);

  const handleLogin = () => {
    setConnected(true); // update state
  };

  const handleLogout = () => {
    setConnected(false);
  };

  return (
    <div>
      { !connected ? <button type="button" onClick={handleLogin}>login</button>
        : (
          <div>
            <button type="button" onClick={handleLogout}>logout</button>
            <AddStudent />
          </div>
        )}
    </div>
  );
}

ReactDOM.render(
  <LoginComponent />,
  document.getElementById('root'),
);
