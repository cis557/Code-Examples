export const addStudent = (student) => ({
  type: 'ADD_STUDENT',
  student,
});

export const setMajorFilter = (major) => ({
  type: 'SET_MAJOR_FILTER',
  major,
});

export const deleteStudent = (id) => ({
  type: 'DELETE_STUDENT',
  id,
});
