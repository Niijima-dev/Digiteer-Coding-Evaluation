import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import api from '../api/axios.js'

function Login(){
    const [email, SetEmail] = useState('');
    const [passwordHash, SetPassword] = useState('');
    const [error, SetError] = useState('');
    const [isLogin, SetIsLogin] = useState(true);
    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        SetError('')

        try{
            const Endpoint = isLogin ? '/User/Login' : '/User/Register'
            const Response = await api.post(Endpoint, {email, passwordHash});

            localStorage.setItem('token', Response.data.token);
            localStorage.setItem('user', JSON.stringify(Response.data.user));

            navigate('/tasks');

        }catch(err){
            SetError(err.Response?.data.message || 'Invalid credentials')
        }
    };

    return(
        <div className="loginContainer">
            <h2>{isLogin ? 'User Login' : 'User Registration'}</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={HandleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => SetEmail(e.target.value)}
                        required                    
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={passwordHash}
                        onChange={(e) => SetPassword(e.target.value)}
                        required   
                        minLength={8}                 
                    />
                </div>

                <button type="submit" className="SubmitButton">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>

            <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => SetIsLogin(!isLogin)}>
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </p>

        </div>
    )
}


export default Login;