import {useRef, useEffect, useState} from 'react';
import { joinChat, verifySession, getUsers, sendMessage, getMessages } from './modules/api';

function App() {
  let username = useRef('');
  let chatUsers = useRef([]);
  // state is the number of connectes users
  const [numUsers, setNumUsers] = useState(0);

  // state for the messages
  const [messages, setmessages] = useState([]);



  // fetch the list of connected users and messages inside useEffect
  useEffect(() =>{
    async function fetchUsers(){
      chatUsers.current = await getUsers();
      // update the state 
      setNumUsers(chatUsers.current.length);
      console.log('users', chatUsers.current);
    }

    async function fetchmessages(){
      const mesgs = await getMessages();
      // update the state
      setmessages(mesgs);
    }


    // we want to fetch the users frequently (5 s)
    //we will use server polling with setInterval
    setInterval(() => {
      fetchUsers();
      fetchmessages();
    }, 5000);
    
  },[numUsers, messages]);


  // if there is a token. we validate the session.
  // otherwise we request a new token
  async function authenticate(e){
    e.preventDefault();
    if(sessionStorage.getItem('token') === null)  {
      // get the web token from the server
      const token = await joinChat(username.current);
      //store token in session storage
      sessionStorage.setItem('token', token);
    }
    else{
      // retrieve the token
      const userToken = sessionStorage.getItem('token');
      // we validate the session
      const code = await verifySession(userToken);
      if(code === 200){
        console.log('session', 'valid');
      }
      if(code === 302){
        console.log('session', 'expired');
        // update a state that will take the user back to
        // the home/login page
      }
    }
  }

  return (
    <div>
      <h2>Enter your username</h2>
      <input type="text" onChange={(e) => username.current = e.target.value}/>
      <button type="button" onClick={(e) => authenticate(e)}>Join the Chat</button>
       <hr />
       <ConnectedUsers users={chatUsers.current}/> 
       <MessagesComponent user={username.current} messages={messages} />

    </div>
  );
}


// connected user component
function ConnectedUsers(props) {
  return(
    <div>
      <h2>Connected Users</h2>
      <div>
        <ul>{props.users.map(user => <li key={user}>{user}</li>)}
        </ul>
      </div>
    </div>
  );
}

// messages component
function MessagesComponent(props) {
  let receiver = useRef('');
  let content = useRef('');
  const handleSendMessage = async(e) =>{
    e.preventDefault();
    await sendMessage(props.user, receiver.current, content.current);
  }


return (
  <div>
    <div>
      <h2>Previous Messages</h2>
      <div>{props.messages.map( msg => <p>{JSON.stringify(msg)}</p>)}</div>
      <hr />
    </div>
    <h2>New Message</h2>
    <label>To: </label><input type="text" onChange={(e) => receiver.current = e.target.value}/>
    <textarea  cols="15" rows="5"  onChange={(e) => content.current = e.target.value}/>
    <button type="button" onClick={(e) => handleSendMessage(e)}>Send</button>
  </div>
);

}

export default App;
