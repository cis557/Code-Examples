/* eslint-disable import/prefer-default-export */
const axios = require('axios');

export const getUsers = async () => {  
  const res = await axios.get('http://localhost:8080/users');
  return res.data.data;
};

export const joinChat = async (user) => { 
  try {
  if(user.length > 0){ 
    const data = `username=${user}`;
    const res = await axios.post('http://localhost:8080/login',data);
    return res.data.token;
  }
 }
 catch (err){
   console.log(err);
 }
};


export const sendMessage = async (sender, receiver, content) => { 
  const data = `to=${receiver}&from=${sender}&message=${content}`; 
  const res = await axios.post('http://localhost:8080/message', data);
  return res.data.message;
};
