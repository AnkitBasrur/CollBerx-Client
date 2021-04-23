import { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";


function Login(){
    const history = useHistory();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loginFunction = async(e) => {
        e.preventDefault();
        console.log("fjfj")
        const res = await axios.post('http://localhost:4000/login', { email: loginEmail, password: loginPassword} )
        if(res.data.message === 'Success')
            history.push('/home')
        else
            setErrorMessage(res.data.message);
        console.log("kfd")

    }

    const signUpFunction = async(e) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:4000/signup', { name: signupName, email: signupEmail, password: signupPassword} )
        if(res.data.message === 'Success')
            history.push('/home')
        else
            setErrorMessage(res.data.message);
        console.log(signupEmail, signupPassword, signupName)
    }
    return (
        <div>
            <form>
                <h1>Login</h1>
                <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /><br />
                <input type="text" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /><br />
                <button type="submit" onClick={(e) => loginFunction(e)}>Submit</button>
            </form>

            <form>
                <h1>Signup</h1>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} /><br />
                <input type="text" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} /><br />
                <input type="text" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} /><br />
                <button type="submit" onClick={(e) => signUpFunction(e)}>Submit</button>
            </form>
            {errorMessage}
        </div>
    )
}

export default Login;