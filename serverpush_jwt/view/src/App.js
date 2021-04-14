import React, { useState, useEffect, useRef } from 'react';
import { getUsers, joinChat, sendMessage } from './getData'; 
import { setupWSConnection } from './notifications';





function App() {
  const [contacts, setContacts] = useState(0); // number of connected users
  // eslint-disable-next-line no-unused-vars
  const [messages, setMessages] = useState(0); // counts messages sent and received - lift up state
  const texts = useRef([]); // mutable reference to store messages. Do not overuse! 
  
  // Put mutators in functions to avoid stale references to state
  // When mutating state inside [websocket] event handlers! 
  const updateContacts = () => setContacts((contacts) => contacts + 1);
  const updateMessages = () => setMessages((messages) => messages + 1);


  useEffect( () => {
      getUsers().then((response) => {
        const parent = document.getElementById("div1");
        const oldChild = document.getElementById("users");
        if(oldChild){
          oldChild.remove(); //delete old list of contacts
        }
        const elt = document.createElement("div");
        elt.setAttribute('id','users');
        response.forEach(element => {
          const p = document.createElement("p");
          p.innerHTML = element;
          elt.appendChild(p);
        });
        parent.appendChild(elt);

      });

      const cleanup = () => {
        sessionStorage.removeItem('token'); // clean the session storage
      }
      // we need to cleanup when leaving the tab
      window.addEventListener('beforeunload', cleanup); 
  
    return () => {
      window.removeEventListener('beforeunload', cleanup);
    }
  });
  

  const authenticate = async () => {
    const name = document.getElementById('usrname').value;
    if(sessionStorage.getItem('token') === null){
      const token = await joinChat(name);  // get the token (jwt) from the web server
        if(token){
          sessionStorage.setItem('token', token); // store token in session storage
        }
    }
    setupWSConnection(updateContacts, updateMessages, texts); // setup ws connection -- pass the wrapper functions as parameters
    setContacts((contacts) => contacts + 1); // update state to trigger re-rendering and useEffect
  }


  // we pass the messages to the child as props
  // the .current property of a mutable reference 
  // contains the messages
  return (
    <div className="App">
      <div>
        <h2>New user</h2>
        <label>Username: </label> <input type="text" id="usrname" />
        { (contacts === 0) ? <button type="button" id="btn"  onClick={() => authenticate()}>Register</button> : null}    
      </div>
      <hr></hr>
      <UsersComponent />
      <MessagesComponent messages={texts.current}  /> 
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

  const sendMsg = () => {
    const text = document.getElementById('msg').value;
    const to = document.getElementById('inptto').value;
    const from = document.getElementById('inptfrom').value;
    if(text.length > 0 && to.length > 0 && from.length > 0){ 
      sendMessage(from, to, text);
    }
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
      <label>From: </label> <input type="text" id="inptfrom" />
      </div>
      <div>
      <label>To: </label> <input type="text" id="inptto" />
      </div>
      <div>
       <textarea cols="15" rows="5" id="msg" />
      <button type="button" id="btn" onClick={() => sendMsg()}>Send</button>
</div>
      
 </div>

  );
}

export default App;