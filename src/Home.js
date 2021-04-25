import { io } from "socket.io-client";
import {useEffect, useState} from 'react';
import './App.css';
import { useHistory } from 'react-router-dom';

const socket = io("http://localhost:5000/");

function Home() {
  const history = useHistory()

  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [activeUsers, setActiveUsers] = useState('');

  useEffect(() => {
    socket.on("Hey", (arg1) => {
      if(arg1.msg === "Success"){
          if(arg1.roomID){
            setCode(arg1.roomID)
            setActiveUsers(arg1.activeUsers)
            history.push({
              pathname: `/main/${arg1.roomID}`,
              state: { roomID: arg1.roomID, activeUsers: arg1.activeUsers}
            }); 
        }
        else{
          setActiveUsers(arg1.activeUsers)
          // history.push({
          //   pathname: `/main/${arg1.roomID}`,
          //   state: { roomID: code, activeUsers }
          // }); 
        }
      }
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
    socket.emit("leave", "10qRc0Qyd");
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
