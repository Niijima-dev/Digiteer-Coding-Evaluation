import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import api from '../api/axios.js'

function Login(){
    const [Email, SetEmail] = useState('');
    const [PasswordHash, SetPassword] = useState('');
    const [Error, SetError] = useState('');
    const [IsLogin, SetIsLogin] = useState(true);
    const Navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        SetError('')

        try{
            const Endpoint = IsLogin ? '/User/Login' : '/User/Register'
            const Response = await api.post(Endpoint, {Email, PasswordHash});

            localStorage.setItem('token', Response.data.token);
            localStorage.setItem('user', JSON.stringify(Response.data.user));

            Navigate('/task');

        }catch(err){
            SetError(err.Response?.data.message || 'Something went wrong (╥﹏╥)')
        }
    };

    return(
        <div>
            <h2 className="FormTitle">{IsLogin ? 'User Login' : 'User Registration'}</h2>

            {Error && <div className="error">{Error}</div>}

            <form onSubmit={HandleSubmit}>
                <div>
                    <input
                        type="email"
                        className="InputFields"
                        placeholder="Email"
                        value={Email}
                        onChange={(e) => SetEmail(e.target.value)}
                        required                    
                    />
                </div>

                <div>
                    <input
                        type="password"
                        className="InputFields"
                        placeholder="Password"
                        value={PasswordHash}
                        onChange={(e) => SetPassword(e.target.value)}
                        required   
                        minLength={8}                 
                    />
                </div>

                <button type="submit" className="SubmitButton">
                    {IsLogin ? 'Login' : 'Register'}
                </button>
            </form>

            <p>
                {IsLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => SetIsLogin(!IsLogin)}>
                    {IsLogin ? 'Register' : 'Login'}
                </button>
            </p>

        </div>
    )
}


export default Login;