import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {ThemeContext} from './contexts/ThemeContext'
import Brightness4Icon from '@material-ui/icons/Brightness4';


function NavBar(props){
    const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;


        return (
          <div>
            <AppBar style={{ backgroundColor:  theme.navbar }} position="static">
              <Toolbar variant="dense" >
                <Typography variant="h6" style={{ color: theme.text, marginLeft: "5%"}}>
                  Home
                </Typography>
                <Typography variant="h6" style={{ color: theme.text, marginLeft: "5%"}} color="inherit">
                  About Us
                </Typography>
                <Typography variant="h6" style={{ color: theme.text, marginLeft: "5%"}} color="inherit">
                  Photos
                </Typography>
                <Typography variant="h6" style={{ color: theme.text, marginLeft: "5%"}} color="inherit">
                  Photos
                </Typography>
                <Brightness4Icon style={{marginLeft: "5%"}} onClick={() => toggleTheme() }/>
              </Toolbar>
            </AppBar>
          </div>
        );  
} 

export default NavBar;
