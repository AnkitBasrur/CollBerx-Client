import { io } from "socket.io-client";
import {useEffect, useState} from 'react';
import './App.css';

const socket = io("http://localhost:5000/");

function App() {
  const [name, setName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    socket.on("Hey", (arg1, callback) => {
      console.log(arg1); 
    });
  })

  function joinRoom(e){
    e.preventDefault();
    console.log(code,name)
    socket.emit('join', code);    
  }
  function createRoom(e){
    e.preventDefault();
    socket.emit("join", adminName);
  }
  function leaveRoom(e){
    e.preventDefault();
    socket.emit("leave", "123");
  }

  
  return (
    <div className="App">
      <form>
        Enter Your Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        Enter Code: <input type="text" value={code} onChange={(e) => setCode(e.target.value)}/>
        <button type="submit"  onClick={(e) => joinRoom(e)} value="Submit">Submit</button>
      </form>
      <form>
        Enter Your Name: <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)}/>
        <button type="submit"  onClick={(e) => createRoom(e)} value="Submit">Submit</button>
      </form>
      <button onClick={(e) =>leaveRoom(e)} >Leave Room</button>
    </div>
  );
}

export default App;
