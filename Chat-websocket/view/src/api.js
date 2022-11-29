import axios from 'axios';

export const getToken = async (username) => { 
    try {
    if(username.length > 0){ 
      const data = `username=${username}`;
      const res = await axios.post('http://localhost:8080/login',data);
      return res.data.token;
    }
   }
   catch (err){
     console.log(err);
   }
  };

  export const verifyToken = async (userToken) => { 
    try {
    if(userToken.length > 0){ 
      const data = `token=${userToken}`;
      const res = await axios.post('http://localhost:8080/verify',data);
      return res.status;
    }
   }
   catch (err){
     console.log(err);
     return 302;
   }
  };

  export const sendMessage = async (sender, receiver, content) => { 
    const data = `to=${receiver}&from=${sender}&message=${content}`; 
    const res = await axios.post('http://localhost:8080/message', data);
    return res.data.message;
  };