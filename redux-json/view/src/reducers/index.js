import { combineReducers } from 'redux';

export const students = (state = [], action) => {
  switch (action.type) { 
    case 'ADD_STUDENT':
      return [
        ...state,
        {
          student: action.student,
        },
      ];
    case 'DELETE_STUDENT':
      return state.filter((student) => ((student.id !== action.id)));
    case 'USER_LOGOUT':
      return []; // empty state
    default:
      return state;
  }
};

export const majorFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_MAJOR_FILTER':
      return action.major;
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  students,
  majorFilter,
});
