import React, { useRef, useState, useEffect } from 'react';
import {getToken, verifyToken, sendMessage } from './api';
// module for websocket operations
import { setupWSConnection } from './notifications';
import './App.css';

function App() {
  //let username = useRef('');
  const [username, setUsername] = useState('');
  const [, setContacts] = useState(0); // number of connected users
  // eslint-disable-next-line no-unused-vars
  const [, setMessages] = useState(0); // counts messages sent and received - lift up state
  const texts = useRef([]); // mutable reference to store messages. Do not overuse! 
  
  // Put mutators in functions to avoid stale references to state
  // When mutating state inside [websocket] event handlers! 
  const updateContacts = () => setContacts((contacts) => contacts + 1);
  const updateMessages = () => setMessages((messages) => messages + 1);


  useEffect( () => {
      
      const cleanup = () => {
        sessionStorage.removeItem('token'); // clean the session storage
      }
      // we need to cleanup when leaving the tab
      window.addEventListener('beforeunload', cleanup); 
  
      return () => {
        window.removeEventListener('beforeunload', cleanup);
      }
    });




  const authenticate = async (e) => {
    e.preventDefault();
    if(sessionStorage.getItem('token') === null){
      const token = await getToken(username);  // get the token (jwt) from the web server
        if(token){
          sessionStorage.setItem('token', token); // store token in session storage
          setupWSConnection(updateContacts, updateMessages, texts); // setup ws connection -- pass the wrapper functions as parameters
        }
    }
    else{
      // get token
      const token = sessionStorage.getItem('token');
      const code = await verifyToken(token);
      if(code === 200){
        console.log('session valid');
        setupWSConnection(updateContacts, updateMessages, texts); // setup ws connection -- pass the wrapper functions as parameters
      }
      if(code === 302){
        console.log('session expired');
      }   
    }
  }

  return (
    <div className="App">
      <label>Username: </label> <input type="text" id="usrname" onChange={(e) => setUsername(e.target.value)} />
        <button type="button" id="btn"  onClick={(e) => authenticate(e)}>Enter Chat</button>
        <hr></hr>
      <UsersComponent />
      <MessagesComponent messages={texts.current} username={username}  />
    </div>
  );
}

// list of users component
function UsersComponent() {
  return (
    <div>
      <h2>Connected users</h2>
      <div id="div1"></div>
      <hr></hr>
 </div>

  );
}
 
// messages component
function MessagesComponent(props) {
  let receiver = useRef('');
  let content = useRef('');

  const sendMsg = async () => {  
    await sendMessage(props.username, receiver.current, content.current);
  }

  return (
    <div>
      <div>
        <h2>Previous messages</h2>
        <div>{props.messages.map(msg => <p>{msg}</p>)}</div>
        <hr></hr>
      </div>
      <div>
      <h2>New message</h2>
      
      <label>To: </label> <input type="text" id="inptto" onChange={(e) => receiver.current =  e.target.value}/>
      </div>
      <div>
       <textarea cols="15" rows="5" id="msg" onChange={(e) => content.current =  e.target.value}/>
      <button type="button" id="btn" onClick={() => sendMsg()}>Send</button>
</div>
      
 </div>

  );
}


export default App;
