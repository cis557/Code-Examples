function StudentRow(props){
    return(
        <tr>
            <td>{props.student.name}</td>
            <td>{props.student.email}</td>
            <td>{props.student.major}</td>
        </tr>
    )
}


function StudentsTable(props){
/** this function create a row for each student
 * in the list of student
 */
    const makeRows = () =>{
        const rows = [];
        props.students.forEach(element => {
            // display all students if no major filter
            if(props.major === ""){
                rows.push(<StudentRow key={element._id} student={element} />); // the row of student
            }
            else{
                if(element.major.startsWith(props.major)){
                    rows.push(<StudentRow key={element._id} student={element} />); // the row of student
                }
            }
        });
        return rows;
    }

    const rows = makeRows();
    return(<div>
        <table>
            <thead>
                <th>Name</th>
                <th>Email</th>
                <th>Major</th>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    </div>);
}

export default StudentsTable;