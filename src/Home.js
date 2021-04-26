import { io } from "socket.io-client";
import {useEffect, useState} from 'react';
import './App.css';
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import { useContext } from "react";
import {ThemeContext} from './contexts/ThemeContext'
import { Button, TextField, Typography } from "@material-ui/core";

const socket = io("http://localhost:5000/");
function Home() {
  const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  const history = useHistory()

  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [activeUsers, setActiveUsers] = useState('');

  const ThemeTextTypography = withStyles({
      root: {
        color: theme.text
      }
  })(Typography);

  const styles = {
    root: {
      background: "black"
    },
    input: {
      color: "white"
    }
  };

  const classes = withStyles(styles)
  console.log(classes.input)

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
    <div className="App" style={{ height: "100vh", backgroundColor:theme.ui }}>
    <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={() => toggleTheme()}>Toggle</Button>
    <ThemeTextTypography variant="h4">Join Room</ThemeTextTypography>
      <form>
        <ThemeTextTypography display="inline" style={{ color: theme.text}}>Enter RoomId:</ThemeTextTypography> <TextField InputProps={{ className: classes.input }}type="text" style={{backgroundColor: theme.button, color: theme.text }} value={code} onChange={(e) => setCode(e.target.value)}/>
        <ThemeTextTypography display="inline" style={{ color: theme.text}}>Enter Room Password:</ThemeTextTypography> <TextField type="text" style={{backgroundColor: theme.button, textColor: theme.text }} value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button type="submit" style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) => joinRoom(e)} value="Submit">Submit</Button>
      </form>
      <ThemeTextTypography variant="h4">Create New Room</ThemeTextTypography>
      <form>
      <ThemeTextTypography display="inline" style={{ color: theme.text}}>Enter Room Password:</ThemeTextTypography><TextField type="text" color="secondary" style={{backgroundColor: theme.button, color: "white" }} value={newRoomPassword} onChange={(e) => setNewRoomPassword(e.target.value)}/>
        <Button type="submit" style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) => createRoom(e)} value="Submit">Submit</Button>
      </form>
      <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) =>leaveRoom(e)}>Leave Room</Button>
    </div>
  );
}

export default Home;
