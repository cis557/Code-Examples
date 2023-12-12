import React, {useState} from "react";
// import the table of students
import StudentsTable from "./StudentsTable"
import SearchBar from "./SearchBar";




function FilterableStudentsTable(props){
    // lifted state the search term 
    const [major, setMajor] = useState('');
    console.log('students', props.students);
 return (
    <div>
        <SearchBar setMajor={setMajor} /> 
        <StudentsTable major={major} students={props.students}/>
 </div>);
}

export default FilterableStudentsTable;