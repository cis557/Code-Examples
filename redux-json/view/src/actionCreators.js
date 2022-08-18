function makeActionCreator(type, ...argNames) {
  return function(...args) {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}


export function loadStudent(studentId, response) {
  return {
    type: 'LOAD_STUDENTS',
    studentId,
    response
  }
}

const ADD_STUDENT = 'ADD_STUDENT'
const EDIT_STUDENT = 'EDIT_TODO'
const REMOVE_STUDENT = 'REMOVE_TODO'

export const addStudent = makeActionCreator(ADD_STUDENT, 'text')
export const editStudent = makeActionCreator(EDIT_STUDENT, 'id', 'text')
export const removeStudent = makeActionCreator(REMOVE_STUDENT, 'id')