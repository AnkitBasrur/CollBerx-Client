import { useEffect, useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useContext } from "react"
import { withStyles } from "@material-ui/core/styles";
import {ThemeContext} from './contexts/ThemeContext'
import { Button, TextField, Typography } from "@material-ui/core";
import LoginNavBar from "./LoginNavBar";
import GitHubIcon from '@material-ui/icons/GitHub';

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
    const { isLightTheme, light, dark } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;
    const history = useHistory();
    const { classes } = props;
    
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
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

    useEffect(async() => {
        const code = window.location.href.match(/\?code=(.*)/) && window.location.href.match(/\?code=(.*)/)[1];

        if(code){
            const tokenResponse = await axios.get(`https://rooms-server-side.herokuapp.com/access-token/${code}`)
            const userResponse = await axios.get(`https://rooms-server-side.herokuapp.com/check-user/${tokenResponse.data.token}`)
            var name = userResponse.data.name;
            if(userResponse.data.name == null)
                name = userResponse.data.username
            if(userResponse.data.isPresent){
                sessionStorage.setItem('username', userResponse.data.username)
                sessionStorage.setItem('name', name)
                history.push('/home')
            }
            else{
                await axios.get(`https://rooms-server-side.herokuapp.com/get-repos/${userResponse.data.username}/${name}/${tokenResponse.data.token}`)
                sessionStorage.setItem('username', userResponse.data.username)
                sessionStorage.setItem('name', name)
                history.push('/home')
            }
        }
    })
    const loginFunction = async(e) => {
        e.preventDefault();
        if(!loginUsername || !loginPassword){
            setErrorMessage("Please enter all fields");

            setTimeout(() => {
                setErrorMessage("");
            }, 5000)
            return
        }
        const res = await axios.post('https://rooms-server-side.herokuapp.com/login', { username: loginUsername, password: loginPassword} )
        if(res.data.message === 'Success'){
            sessionStorage.setItem('username', loginUsername)
            sessionStorage.setItem('name', res.data.name)
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
        if(!signupName || !signupUsername || !signupPassword){
            setSignUpErrorMessage("Please enter all fields");

            setTimeout(() => {
                setSignUpErrorMessage("");

            }, 5000)
            return
        }
        const res = await axios.post('https://rooms-server-side.herokuapp.com/signup', { name: signupName, username: signupUsername, password: signupPassword} )
        if(res.data.message === 'Success'){
            sessionStorage.setItem('username', signupUsername)
            sessionStorage.setItem('name', signupName)
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
            <Button style={{ marginLeft: "41%", marginTop: "5%", border: "1px solid grey"}}>
                <a
                    style={{color: theme.text}}
                    className="login-link"
                    href={`https://github.com/login/oauth/authorize?scope=user&client_id=d38bd993581d49e7499c`}
                >
                    <GitHubIcon />
                    <span className="link-text"> Login Or SignUp with GitHub</span>
                </a>
            </Button>
            <ThemeTextTypography style={{textAlign: 'center', marginTop:"1%"}} variant="h3">OR</ThemeTextTypography>
            <div style={{ borderRadius:"15px", marginLeft:"36%", marginTop:"1%", width:"28%", backgroundColor: theme.box, textAlign: "center"}}>
                
                <Button onClick={() => { setShowSignup(false); setShowLogin(true) }} style={{ width: "50%", borderRadius:"0", backgroundColor: theme.innerBox, color: theme.text }}>Show Login</Button>
                <Button onClick={() => {setShowLogin(false); setShowSignup(true) }} style={{ width: "50%", borderRadius:"0", backgroundColor: theme.innerBox, color: theme.text }}>Show Sign Up</Button>
                    {showLogin ?
                    <form>
                        <ThemeTextTypography variant="h4" style={{ fontFamily: "DejaVu Sans Mono", marginTop: "3%"}}><b>Log In</b></ThemeTextTypography>
                        <TextField InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} type="text" label="Enter Username" style={{marginTop: "5%", backgroundColor: theme.input }} value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}/><br /><br />
                        <TextField InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} type="password" label="Enter Password" style={{marginTop: "5%", backgroundColor: theme.input }} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/><br /><br />
                        <Button type="submit" style={{marginTop: "5%", backgroundColor: theme.innerBox, color: theme.text }} onClick={(e) => loginFunction(e)}>Submit</Button>
                        <ThemeTextTypography variant="h5" style={{ color: "tomato"}}>{errorMessage}</ThemeTextTypography>
                    </form> : null }
                    
                    {showSignup ?
                    <form>
                        <ThemeTextTypography variant="h4" style={{ fontFamily: "DejaVu Sans Mono" }}><b>Sign Up</b></ThemeTextTypography>
                        <TextField type="text" label="Enter Your Name" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.input }} value={signupName} onChange={(e) => setSignupName(e.target.value)}/><br /><br />
                        <TextField type="text" label="Enter Username" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.input }} value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)}/><br /><br />
                        <TextField type="password" label="Enter Password" InputLabelProps={{ style: { color: theme.placeholder, fontSize: "22px"}}} InputProps={{ className: isLightTheme ? classes.light: classes.dark }} style={{backgroundColor: theme.input }} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}/><br /><br />
                        <Button type="submit" style={{backgroundColor: theme.innerBox, color: theme.text }} onClick={(e) => signUpFunction(e)}>Submit</Button>
                        <ThemeTextTypography variant="h5" style={{color: "tomato"}}>{signUpErrorMessage}</ThemeTextTypography>
                    </form> : null }
            </div>
        </div>
    )
}

export default withStyles(styles)(Login);