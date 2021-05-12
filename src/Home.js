import {useEffect, useState} from 'react';
import './App.css';
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import { useContext } from "react";
import {ThemeContext} from './contexts/ThemeContext'
import { Button, Card, CardActionArea, CardContent, Grid, TextField, Typography } from "@material-ui/core";
import NavBar from "./NavBar";
import axios from "axios";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

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
      const projects = await axios.get(`https://rooms-server-side.herokuapp.com/getProjects/${sessionStorage.getItem("email")}`)
      setProjects(projects.data.room)
      setShouldFetch(false)
    }
  })

  function handleProject(roomID, authLevel){
    history.push({
      pathname: `/main/${roomID}`,
      state: { authLevel }
    }); 
  }
  
  return (
    <div >
    <NavBar />
    <div className="App" style={{ minHeight: "93.5vh", width: "100%", backgroundColor:theme.ui }}>
      <ThemeTextTypography style={{fontFamily: "Verdana", marginBottom: "1%", paddingTop: "1%"}} variant="h4"><b>Your Rooms:</b></ThemeTextTypography>
        <Grid container style={{paddingLeft: "8%"}}>
                {projects.map((row,i)=>{
                    return(
                        <Grid key={i} style={{marginRight:"20px", marginBottom: "20px"}} item xs={2}>
                            <Card style={{boxShadow: "2px 2px 2px #575859", backgroundColor: theme.innerBox}} onClick={()=> handleProject(row.roomID, row.data.authLevel)}>
                                <CardActionArea>
                                    <CardContent>
                                    <div style={{ textAlign: "center" }}>
                                        <ThemeTextTypography gutterBottom style={{fontFamily: "Georgia"}} variant="h5">
                                            <b>{row.name}</b>
                                        </ThemeTextTypography>
                                        <ThemeTextTypography variant="h6" color="textSecondary">
                                            {row.designation}
                                        </ThemeTextTypography>
                                        <ThemeTextTypography variant="h6" style={{color: theme.textNotImp}}>
                                            {row.data.authLevel} 
                                        </ThemeTextTypography>
                                        <FiberManualRecordIcon fontSize="small" style={{ color: "red" }} /> 
                                        <ThemeTextTypography style={{fontSize:"25px"}}display="inline" variant="h6" color="textSecondary">
                                            <b> {row.members.length}</b> 
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
    </div>
  );
}

export default withStyles(styles)(Home);
