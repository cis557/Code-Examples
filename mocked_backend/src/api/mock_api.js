import axios from 'axios';

// mockAPI URL
// const rootURL ='https://633a4b96471b8c39556b9649.mockapi.io/api/v1/Student';
// JSON-server URL
const rootURL = 'http://localhost:8000/students';
// Sends a Get request to the /student endpoint
// returns all the students in the DB
export const getStudents = async () => {
  try {
    const response = await axios.get(`${rootURL}`);
    return response.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err);
  }
};

// Takes the id of a student as input
// and sends a Get request to the /student:id endpoint
// returns the attributes of the student
export const getStudent = async (studentID) => {
  try {
    const response = await axios.get(`${rootURL}/${studentID}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// Takes a student (without the id) as input
// and sends a POST request to the /student endpoint
// returns the attributes of the student with the id
export const createStudent = async (studentObject) => {
  try {
    const response = await axios.post(
      `${rootURL}`,
      `name=${studentObject.name}&major=${studentObject.major}&email=${studentObject.email}`,
    );
    console.log(`name=${studentObject.name}&major=${studentObject.major}&email=${studentObject.email}`);
    return response.data;
    // return the data with the id of the student
  } catch (err) {
    console.error(err);
  }
};
