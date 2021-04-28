import { io } from "socket.io-client";
import {useEffect, useState} from 'react';
import './App.css';
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import { useContext } from "react";
import {ThemeContext} from './contexts/ThemeContext'
import { Button, Card, CardActionArea, CardContent, Grid, TextField, Typography } from "@material-ui/core";
import NavBar from "./NavBar";
import axios from "axios";
import { useCookies } from "react-cookie";

const styles = {
  light: {
      color: "black",
      fontSize: "22px"
  },
  dark: {
      color: "white",
      fontSize: "22px"
  }
};

const socket = io("http://localhost:5000/");
function AddRoom(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  const history = useHistory()
  const { classes } = props;

  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [activeUsers, setActiveUsers] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [projects, setProjects] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true)

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


  useEffect(async () => {
    if(shouldFetch){
      const projects = await axios.get(`http://localhost:4000/getProjects/a`)
      setProjects(projects.data)
      setShouldFetch(false)
    }
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
    socket.emit('join', code, password, sessionStorage.getItem("email"));    
  }

  function createRoom(e){
    e.preventDefault();
    socket.emit("create room", newRoomPassword, sessionStorage.getItem("email"), newRoomName);
  }
  
  return (
    <>
    <NavBar />
    <div className="App" style={{ height: "100vh", backgroundColor:theme.ui }}>
    <ThemeTextTypography variant="h4">Join Room</ThemeTextTypography>
      <form>
        <ThemeTextTypography display="inline" style={{ color: theme.text}}>
          Enter RoomId:
        </ThemeTextTypography> 
        <TextField InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} type="text" style={{backgroundColor: theme.button, color: theme.text }} value={code} onChange={(e) => setCode(e.target.value)}/><br /><br />
        <ThemeTextTypography display="inline" style={{ color: theme.text}}>
          Enter Room Password:
        </ThemeTextTypography> 
        <TextField type="password" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button, textColor: theme.text }} value={password} onChange={(e) => setPassword(e.target.value)}/><br /><br />
        <Button type="submit" style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) => joinRoom(e)} value="Submit">Submit</Button>
      </form><br />
      <ThemeTextTypography variant="h4">Create New Room</ThemeTextTypography>
      <form>
      <ThemeTextTypography display="inline" style={{ color: theme.text}}>
        Enter Room Name:
      </ThemeTextTypography>
      <TextField type="text" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button, color: "white" }} value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)}/><br /><br />
      <ThemeTextTypography display="inline" style={{ color: theme.text}}>
        Enter Room Password:
      </ThemeTextTypography>
      <TextField type="password" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.button, color: "white" }} value={newRoomPassword} onChange={(e) => setNewRoomPassword(e.target.value)}/><br /><br />
        <Button type="submit" style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) => createRoom(e)} value="Submit">Submit</Button><br /><br />
      </form>
      
      {/* <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) =>leaveRoom(e)}>Leave Room</Button> */}
    </div>
    </>
  );
}

export default withStyles(styles)(AddRoom);
