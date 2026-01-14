import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import api from '../api/axios.js'

function Login(){
    const [email, SetEmail] = useState('');
    const [passwordHash, SetPassword] = useState('');
    const [error, SetError] = useState('');
    const [isLogin, SetIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        SetError('')
        setLoading(true);

        try{
            const Endpoint = isLogin ? '/User/Login' : '/User/Register'
            const Response = await api.post(Endpoint, {email, passwordHash});

            localStorage.setItem('token', Response.data.token);
            localStorage.setItem('user', JSON.stringify(Response.data.user));

            navigate('/tasks');

        }catch(err){
            const status = err.response?.status;

            if (status === 401) {
                SetError(err.response?.data?.message || 'Invalid credentials');
            } else if (status === 400) {
                SetError(err.response?.data?.message || 'Bad request');
            } else if (status === 500) {
                SetError('Internal Server Error');
            } else {
                SetError('Something went wrong');
            }
        }finally{
            setLoading(false);
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
                        disabled={loading}                    
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
                        disabled={loading}              
                    />
                </div>

                <button type="submit" className="SubmitButton" disabled={loading}>
                    {loading? 'Please wait...' : isLogin ? 'Login' : 'Register'}
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