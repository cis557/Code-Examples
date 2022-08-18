/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { rootReducer } from './reducers/index';
import { addStudent, setMajorFilter } from './actions/index';
// load data from the json file
import students from './assets/students.json';

// create the redux store
const store = createStore(rootReducer);

function fetchStudents() {
  return students;
}

/**
 * NameCell pure component
 * @param {*} props - an object {name, major, email} representing the student to display
 * @returns NameCell elements
 */
function NameCell(props) {
  const url = `/#`;
  return (
    <td>
      <a href={url}>{props.student.name}</a>
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
function StudentTable() {
  // extract states from store
  const studentsList = useSelector((state) => state.students);
  const majorFilter = useSelector((state) => state.majorFilter);

  const makeRows = () => {
    const rows = [];
    studentsList.forEach((element) => {
      const { student } = element;
      if (majorFilter === 'SHOW_ALL') {
        rows.push(
          <StudentRow
            student={student}
            key={student.name}
          />,
        );
      } else {
        if (!student.major.startsWith(majorFilter)) {
          return;
        }
        rows.push(
          <StudentRow
            student={student}
            key={student.name}
          />,
        );
      }
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
 * @returns SearchBar elements
 */
function SearchBar() {
  const handleFilterTextChange = (e) => {
    // update store (dispatch action)
    store.dispatch(setMajorFilter(e.target.value));
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Search by major..."
        onChange={handleFilterTextChange}
      />
    </form>
  );
}
/**
 * FilterableStudentsTable component
 * @returns FilterableStudentsTable elements
 */
function FilterableStudentsTable() {
  const dispatch = useDispatch();

  useEffect(() => {
    // get data from JSON file, update store (dispatch action)

     function fetchData() {
      const x = fetchStudents();
      x.forEach((element) => {
        dispatch(addStudent({
          // id: element.id,
          name: element.name,
          email: element.email,
          major: element.major,
        }));
      });
    }
    fetchData();

    const unsubscribeStore = store.subscribe(() => {
      console.log('cleanup', store.getState().students.length);
    });

    return unsubscribeStore;
  });

  return (
    <div>
      <SearchBar />
      <StudentTable />
    </div>
  );
}
/**
 * AddStudent component
 * @returns AddStudent elements
 */
function AddStudent() {
  // local state
  const [newStudent, setNewStudent] = useState({ name: '', email: '', major: '' });

  const handleOnChange = (e) => {
    e.persist();
    if (e.target.name === 'name') {
      setNewStudent(() => ({
        name: e.target.value,
        email: newStudent.email,
        major: newStudent.major,
      }));
    }
    if (e.target.name === 'email') {
      setNewStudent((newStudent) => ({
        name: newStudent.name,
        email: e.target.value,
        major: newStudent.major,
      }));
    }
    if (e.target.name === 'major') {
      setNewStudent((newStudent) => ({
        name: newStudent.name,
        email: newStudent.email,
        major: e.target.value,
      }));
    }
  };
  const handleCreateStudent = (e) => {
    e.preventDefault();
    store.dispatch(addStudent(newStudent)); // dispatch action add student to store
  };

  return (
    <form onSubmit={handleCreateStudent}>
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
  }

  const handleLogout = () => {
    store.dispatch({ type: 'USER_LOGOUT' });
    setConnected(false);
  };

  return (
    <div>
      { !connected ? <button type="button" onClick={handleLogin}>login</button>
        : (
          <div>
            <button type="button" onClick={handleLogout}>logout</button>
            <FilterableStudentsTable />
            <AddStudent />
          </div>
        )}
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <LoginComponent />
  </Provider>,
  document.getElementById('root'), 
);
