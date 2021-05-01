import { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useContext } from "react"
import { withStyles } from "@material-ui/core/styles";
import {ThemeContext} from './contexts/ThemeContext'
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { useCookies } from "react-cookie";
import LoginNavBar from "./LoginNavBar";

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

function Login(props){
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const { isLightTheme, light, dark } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;
    const history = useHistory();
    const { classes } = props;
    
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
    const [showLogin, setShowLogin] = useState(true);
    const [showSignup, setShowSignup] = useState(false)

    const ThemeTextTypography = withStyles({
        root: {
          color: theme.text
        }
    })(Typography);

    const loginFunction = async(e) => {
        e.preventDefault();
        if(!loginEmail || !loginPassword){
            setErrorMessage("Please enter all fields");

            setTimeout(() => {
                setErrorMessage("");
            }, 5000)
            return
        }
        const res = await axios.post('http://localhost:4000/login', { email: loginEmail, password: loginPassword} )
        if(res.data.message === 'Success'){
            sessionStorage.setItem('email', loginEmail)
            setCookie("email", loginEmail, { path: '/' });
            history.push('/home')
        }
        else{
            setErrorMessage(res.data.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 5000)
        }

    }

    const signUpFunction = async(e) => {
        e.preventDefault();
        if(!signupName || !signupEmail || !signupPassword){
            setSignUpErrorMessage("Please enter all fields");

            setTimeout(() => {
                setSignUpErrorMessage("");

            }, 5000)
            return
        }
        const res = await axios.post('http://localhost:4000/signup', { name: signupName, email: signupEmail, password: signupPassword} )
        if(res.data.message === 'Success'){
            sessionStorage.setItem('email', signupEmail)
            setCookie("email", signupEmail, { path: '/'});
            history.push('/home')
        }
        else{
            setSignUpErrorMessage(res.data.message);
            setTimeout(() => {
                setSignUpErrorMessage("");
            }, 5000)
        }
    }
    return (
        <div style={{ paddingBottom: "10%", minHeight: "79.5vh", backgroundColor: theme.ui}}>
        <LoginNavBar />
            <div style={{ borderRadius:"15px", marginLeft:"35%", marginTop:"10%", width:"28%", backgroundColor: theme.box, textAlign: "center"}}>
            
            <Button onClick={() => { setShowSignup(false); setShowLogin(true) }} style={{ width: "50%", borderRadius:"0", backgroundColor: theme.innerBox, color: theme.text }}>Show Login</Button>
            <Button onClick={() => {setShowLogin(false); setShowSignup(true) }} style={{ width: "50%", borderRadius:"0", backgroundColor: theme.innerBox, color: theme.text }}>Show Sign Up</Button>
                {showLogin ?
                <form>
                    <ThemeTextTypography variant="h4" style={{ fontFamily: "DejaVu Sans Mono", marginTop: "3%"}}><b>Log In</b></ThemeTextTypography>
                    <TextField InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} type="text" label="Enter Email" style={{marginTop: "5%", backgroundColor: theme.input }} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/><br /><br />
                    <TextField InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} type="password" label="Enter Password" style={{marginTop: "5%", backgroundColor: theme.input }} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/><br /><br />
                    <Button type="submit" style={{marginTop: "5%", backgroundColor: theme.innerBox, color: theme.text }} onClick={(e) => loginFunction(e)}>Submit</Button>
                    <ThemeTextTypography variant="h5" style={{ color: "tomato"}}>{errorMessage}</ThemeTextTypography>
                </form> : null }
                
                {showSignup ?
                <form>
                    <ThemeTextTypography variant="h4" style={{ fontFamily: "DejaVu Sans Mono" }}><b>Sign Up</b></ThemeTextTypography>
                    <TextField type="text" label="Enter Your Name" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.input }} value={signupName} onChange={(e) => setSignupName(e.target.value)}/><br /><br />
                    <TextField type="text" label="Enter Email" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.input }} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}/><br /><br />
                    <TextField type="password" label="Enter Password" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.input }} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}/><br /><br />
                    <Button type="submit" style={{backgroundColor: theme.innerBox, color: theme.text }} onClick={(e) => signUpFunction(e)}>Submit</Button>
                    <ThemeTextTypography variant="h5" style={{color: "tomato"}}>{signUpErrorMessage}</ThemeTextTypography>
                </form> : null }
            </div>
        </div>
    )
}

export default withStyles(styles)(Login);