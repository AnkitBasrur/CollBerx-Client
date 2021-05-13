import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {ThemeContext} from './contexts/ThemeContext'
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { useHistory } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";

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

function NavBar(props){
    const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;
    const history = useHistory()

    const ThemeTextTypography = withStyles({
      root: {
        color: theme.text
      }
    })(Typography);

    return (
      <div>
        <AppBar style={{ backgroundColor:  theme.navbar }} position="static">
          <Toolbar variant="dense" >
            <ThemeTextTypography  onClick={() => history.push('/home')} variant="h5" style={{ fontFamily: "Arial", cursor: "pointer", marginLeft: "7%"}}>
              CollBerx
            </ThemeTextTypography>
            <ThemeTextTypography  onClick={() => history.push('/home')} variant="h6" style={{ fontFamily: "Arial", cursor: "pointer", marginLeft: "23%"}}>
              Home
            </ThemeTextTypography>
            <ThemeTextTypography onClick={() => history.push('/addRoom')} variant="h6" style={{ fontFamily: "Arial", cursor: "pointer", marginLeft: "5%"}} >
              Add Room
            </ThemeTextTypography>
            <ThemeTextTypography variant="h6" style={{ fontFamily: "Arial", cursor: "pointer", color: theme.text, marginLeft: "5%"}} >
              About Us
            </ThemeTextTypography>
            <Brightness4Icon style={{ cursor: "pointer", marginLeft: "5%"}} onClick={() => toggleTheme() }/>
            <ThemeTextTypography variant="h6" style={{ fontFamily: "Arial", marginLeft: "15%"}} >
              Hello, {sessionStorage.getItem("email")}
            </ThemeTextTypography>
            <ThemeTextTypography onClick={() => { sessionStorage.removeItem("email");history.push('/') }} variant="h6" style={{ fontFamily: "Arial", cursor: "pointer",color: theme.text, marginLeft: "5%"}} >
              Logout
            </ThemeTextTypography>
          </Toolbar>
        </AppBar>
      </div>
    );  
} 

export default withStyles(styles)(NavBar);
