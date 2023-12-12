import React from "react";
import { createNewStudent } from '../api/students';
/**
 * Adds a new student to the roster
 * @param {*} props  the list of student mutator 
 * function
 */
function AddStudent(props){

    async function creatAStudentWrapper(newStudent){
        // create a student
        let response = await createNewStudent(newStudent);
        console.log('new student', response);
        return response;
      }

    let newName;
    let newEmail;
    let newMajor;
    const handleOnChange = (e) =>{
        // check if the name was updated
        if(e.target.name === "name"){
            newName = e.target.value;
        }
        if(e.target.name === "email"){
            newEmail = e.target.value;
        }
        if(e.target.name === "major"){
            newMajor = e.target.value;
        }
    } 


    const handleOnSubmit = (e) =>{
        // prevent the form submit event to 
        // reload the page
        e.preventDefault();
        const newStudent ={name: newName, email: newEmail, major:newMajor};

        //reset the form
        const form = document.getElementById("add");
        form.reset();
        // send new student to the backend
        creatAStudentWrapper(newStudent);
        // update the state
        props.addNewStudent([...props.students, newStudent]);
    }

    return(
        <div>
            { ' '}
            <form id="add" onSubmit={handleOnSubmit}>
                <input 
                type="text"
                name="name"
                id="name"
                placeholder="Name ..."
                onChange={handleOnChange}
                />
                <input 
                type="text"
                name="email"
                id="email"
                placeholder="Email ..."
                onChange={handleOnChange}
                />
                <input 
                type="text"
                name="major"
                id="major"
                placeholder="Major ..."
                onChange={handleOnChange}
                />
                <button type="submit" id="new">Add new student</button>
            </form>
        </div>

    )

}

export default AddStudent;