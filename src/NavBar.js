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
import { useCookies } from "react-cookie";


function NavBar(props){
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;
    const history = useHistory()


        return (
          <div>
            <AppBar style={{ backgroundColor:  theme.navbar }} position="static">
              <Toolbar variant="dense" >
                <Typography onClick={() => history.push('/home')} variant="h6" style={{ color: theme.text, marginLeft: "5%"}}>
                  Home
                </Typography>
                <Typography onClick={() => history.push('/addRoom')} variant="h6" style={{ color: theme.text, marginLeft: "5%"}} color="inherit">
                  Add Room
                </Typography>
                <Typography variant="h6" style={{ color: theme.text, marginLeft: "5%"}} color="inherit">
                  Photos
                </Typography>
                <Typography variant="h6" style={{ color: theme.text, marginLeft: "5%"}} color="inherit">
                  Photos
                </Typography>
                <Brightness4Icon style={{marginLeft: "5%"}} onClick={() => toggleTheme() }/>
                <Typography onClick={() => { sessionStorage.removeItem("email");history.push('/') }} variant="h6" style={{ color: theme.text, marginLeft: "47%"}} color="inherit">
                  Logout
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
        );  
} 

export default NavBar;
