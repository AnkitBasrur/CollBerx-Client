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

function Home() {
  const [cookies] = useCookies(["user"]);
  const { isLightTheme, light, dark } = useContext(ThemeContext);
  const theme = isLightTheme ? light : dark;
  const history = useHistory()
  const [projects, setProjects] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true)

  const ThemeTextTypography = withStyles({
      root: {
        color: theme.text
      }
  })(Typography);

  useEffect(async () => {
    if(shouldFetch){
      const projects = await axios.get(`http://localhost:4000/getProjects/${sessionStorage.getItem("email")}`)
      setProjects(projects.data)
      setShouldFetch(false)
    }
  })

  function handleProject(roomID){
    // socket.emit("leave", "10qRc0Qyd");
    console.log("jj")
    history.push({
      pathname: `/main/${roomID}`,
      state: { roomID, activeUsers: 1}
    }); 
  }
  
  return (
    <>
    <div className="App" style={{ height: "100vh", backgroundColor:theme.ui }}>
    <NavBar />
      <ThemeTextTypography variant="h4">Your Rooms:</ThemeTextTypography>
        <Grid style={{marginLeft:"2%"}} container spacing={3}>
                {projects.map((row,i)=>{
                    return(
                        <Grid key={i} style={{marginRight:"2%"}} item xs={2}>
                            <Card style={{boxShadow: "2px 2px 2px #575859", backgroundColor: "#353536"}} onClick={()=> handleProject(row.roomID)}>
                                <CardActionArea>
                                    <CardContent>
                                    <div style={{ textAlign: "center" }}>
                                        <ThemeTextTypography gutterBottom variant="h5">
                                            {row.name}
                                        </ThemeTextTypography>
                                        <ThemeTextTypography variant="h6" color="textSecondary">
                                            {row.designation}
                                        </ThemeTextTypography>
                                    </div>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })}
          </Grid>
      {/* <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) =>leaveRoom(e)}>Leave Room</Button> */}
    </div>
    </>
  );
}

export default withStyles(styles)(Home);
