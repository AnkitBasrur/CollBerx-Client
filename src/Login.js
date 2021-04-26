import { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useContext } from "react"
import { withStyles } from "@material-ui/core/styles";
import {ThemeContext} from './contexts/ThemeContext'
import { Button, TextField, Typography } from "@material-ui/core";

function Login(){
    const { isLightTheme, light, dark, toggleTheme } = useContext(ThemeContext);
    const theme = isLightTheme ? light : dark;
    const history = useHistory();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const ThemeTextTypography = withStyles({
        root: {
          color: theme.text
        }
    })(Typography);

    const loginFunction = async(e) => {
        e.preventDefault();
        console.log("fjfj")
        const res = await axios.post('http://localhost:4000/login', { email: loginEmail, password: loginPassword} )
        if(res.data.message === 'Success')
            history.push('/home')
        else
            setErrorMessage(res.data.message);

    }

    const signUpFunction = async(e) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:4000/signup', { name: signupName, email: signupEmail, password: signupPassword} )
        if(res.data.message === 'Success')
            history.push('/home')
        else
            setErrorMessage(res.data.message);
    }
    return (
        <div style={{  minHeight: "100vh", backgroundColor: theme.ui}}>
            <Button style={{backgroundColor: theme.button, color: theme.text }} onClick={() => toggleTheme()} >Toggle</Button>
            <form>
                <ThemeTextTypography variant="h4">Login</ThemeTextTypography>
                <TextField type="text" label="Enter Email" style={{backgroundColor: theme.button, color: theme.text }} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}/><br /><br />
                <TextField type="text" label="Enter Password" style={{backgroundColor: theme.button, color: theme.text }} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/><br /><br />
                <Button type="submit" style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) => loginFunction(e)}>Submit</Button>
            </form>

            <form>
                <ThemeTextTypography variant="h4">Signup</ThemeTextTypography>
                <TextField type="text" label="Enter Your Name" style={{backgroundColor: theme.button, color: theme.text }} value={signupName} onChange={(e) => setSignupName(e.target.value)}/><br /><br />
                <TextField type="text" label="Enter Email" style={{backgroundColor: theme.button, color: theme.text }} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}/><br /><br />
                <TextField type="text" label="Enter Password" style={{backgroundColor: theme.button, color: theme.text }} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}/><br /><br />
                <Button type="submit" style={{backgroundColor: theme.button, color: theme.text }} onClick={(e) => signUpFunction(e)}>Submit</Button>
            </form>
            {errorMessage}
        </div>
    )
}

export default Login;