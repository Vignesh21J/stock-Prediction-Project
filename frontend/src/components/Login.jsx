/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

// import axios from 'axios';
import axiosInstance from '../axiosInstance';

import { useNavigate } from 'react-router-dom';



import { AuthContext } from './AuthProvider';


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [error, setError] = useState('');

    

    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);



    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {username, password};
        // console.log(userData);

        try {
            const response = await axiosInstance.post('http://127.0.0.1:8000/api/v1/token/', userData)
            // console.log(response.data);

            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)

            console.log('Login successful');
            setIsLoggedIn(true);

            navigate('/dashboard')
        }
        
        
        catch(error) {
            console.error('Invalid credentials');
            setError('Invalid credentials');
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 p-5 rounded-2 bg-light-dark ">

                    <h3 className='text-light text-center mb-5'>Login</h3>

                    <form onSubmit={handleLogin}>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='form-control mt-3' placeholder='Username' />
                        
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='form-control mt-3' placeholder='Set Password' />
                        
                        {error && <div className='text-danger text-center mt-2 fw-bold '>{error}</div>}

                        {loading ? (
                            <button type='submit' className='btn btn-success mt-5 d-block mx-auto'> <FontAwesomeIcon icon={faSpinner} spin /> Logging in...</button>
                        ) : (
                            <button type='submit' className='btn btn-success mt-5 d-block mx-auto'>Login</button>
                        )}

                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login