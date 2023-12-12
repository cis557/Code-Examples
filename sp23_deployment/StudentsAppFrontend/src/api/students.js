// HTTP client
import axios from "axios";
import { rootURL } from "../utils/utils";
/**
 * This module contains HTTP calls to the backend
 */

/**
 * Adds the JWT to the header of an HTTP request
 */
const setHeaders = () =>{
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('app-token');
}

/**
 * This function authenticates the user
 * sends a POSt request to the login endpoint
 * returns the JWT
 */
export const loginUser = async (username) => {
    try{
        const response = await axios.post(`${rootURL}/login`, `name=${username}`);
        // return the token
        return response.data.apptoken;
    } catch (err){
        console.log('error', err.message);
    }
}


/**
 * get all the students from the backend
 */
export const getAllStudents = async () =>{
    // always use try/catch in an async function
    try{
        const response = await axios.get(`${rootURL}/students`);
        console.log("all students", response.data);
        return response.data.data;

    }catch (err){
        console.error('error', err.message);
    }
}

/**
 * Get a student by their id
 */

export const getStudentById = async (id) =>{
    // always use try/catch in an async function
    try{
        const response = await axios.get(`${rootURL}/student/${id}`);
        console.log("A student", response.data);
        return response.data.data;

    }catch (err){
        console.error('error', err.message);
    }
}

/**
 * Create a new student
 */

export const createNewStudent = async (studentObject) =>{
    // always use try/catch in an async function
    try{
        // add the token to the header
        setHeaders();
        const response = await axios.post(`${rootURL}/student`,
            `name=${studentObject.name}&email=${studentObject.email}&major=${studentObject.major}`);
        console.log("A response", response.data);
        return response.data.data;

    }catch (err){
        console.error('error', err.message);
    }
}