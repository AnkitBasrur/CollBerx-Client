import { io } from "socket.io-client";
import {useEffect, useState} from 'react';
import './App.css';

const socket = io("http://localhost:5000/");

function Home() {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');

  useEffect(() => {
    socket.on("Hey", (arg1) => {
      console.log(arg1); 
    });
  })

  function joinRoom(e){
    e.preventDefault();
    socket.emit('join', code, password);    
  }

  function createRoom(e){
    e.preventDefault();
    socket.emit("create room", newRoomPassword, "Ankit");
  }
  function leaveRoom(e){
    e.preventDefault();
    socket.emit("leave", "123");
  }

  
  return (
    <div className="App">
      <form>
        Enter RoomId: <input type="text" value={code} onChange={(e) => setCode(e.target.value)}/>
        Enter Room Password: <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit"  onClick={(e) => joinRoom(e)} value="Submit">Submit</button>
      </form>
      <form>
        Enter Room Password: <input type="text" value={newRoomPassword} onChange={(e) => setNewRoomPassword(e.target.value)}/>
        <button type="submit"  onClick={(e) => createRoom(e)} value="Submit">Submit</button>
      </form>
      <button onClick={(e) =>leaveRoom(e)} >Leave Room</button>
    </div>
  );
}

export default Home;
