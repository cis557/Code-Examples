import axios from 'axios';

// mockAPI URL
// const rootURL ='https://633a4b96471b8c39556b9649.mockapi.io/api/v1/Student';
// JSON-server URL
const rootURL = 'http://localhost:8080'; // students';

// Add the token to all HTTP request
const setHeaders =() =>{
  axios.defaults.headers.common['Authorization'] = (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null;
}

/**
 * 
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = (status) => {
  if(status === 401){
    // delete the token
    sessionStorage.removeItem('app-token');
    //reload the app
    window.location.reload(true);
  }
}


// Sends a Get request to the /student endpoint
// returns all the students in the DB
export const getStudents = async () => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${rootURL}/students`);
    return response.data.data;
    // the data is stored in the mockData
    // field of the response
  } catch (err) {
    console.error(err); // lopg error
    reAuthenticate(401);
    //throw new Error("there was an error");
  }
};

// Takes the id of a student as input
// and sends a Get request to the /student:id endpoint
// returns the attributes of the student
export const getStudent = async (studentID) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.get(`${rootURL}/student/${studentID}`);
    reAuthenticate(response.status);
    return response.data.data;
  } catch (err) {
    reAuthenticate(401);
    console.error(err);
  }
};

// Takes a student (without the id) as input
// and sends a POST request to the /student endpoint
// returns the attributes of the student with the id
export const createStudent = async (studentObject) => {
  try {
    // add the token to the header
    setHeaders();
    const response = await axios.post(
      `${rootURL}/student/`,
      `name=${studentObject.name}&major=${studentObject.major}&email=${studentObject.email}`,
    );
    console.log(`name=${studentObject.name}&major=${studentObject.major}&email=${studentObject.email}`);
    return response.data.data;
    // return the data with the id of the student
  } catch (err) {
    console.error(err);
  }
};

/**
 * sends a login request to the backend
 *
 */
export const login = async (username) =>{
  try{
    const response = await axios.post(
      `${rootURL}/login`,
      `username=${username}`);

      // store the token
      sessionStorage.setItem('app-token', response.data.token);
      return response.data.token;
  }catch(err){
    console.error(err);
  }
}
