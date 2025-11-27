import React, { useState } from 'react';

// import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


// CORS[Cross Origin Resource Sharing]: It is a Web Security Feature, that STOPS one website, from asking for a, data from the different website without permission.
// Ex: localhost:5173. This is our FrontEnd domain, this is asking for a data from the different domain which is 127.0.0.1:8000.

// So, essentially our localhost 5173 is asking for a data from this backend server.
// const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData);

// So, Django doesn't know who is localhost 5173 domain. So that's why it is saying, I don't know who is localhost 5173 so I cannot give data to this guy.

// So, install a django-cors-header in django, then django will allow this domain to get the data from backend domain.


import axiosInstance from '../axiosInstance';




const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Creating User Data Object and send it with the API req.
        const userData = {
            username, email, password
        }

        // console.log(userData);

        // Axios Library used to send the API request from frontend to the backend server. Below is POST req.

        try {
            const response = await axiosInstance.post('register/', userData);
            console.log(response.data);

            console.log('Register successful');

            setSuccess(true);
            setErrors({});
        }
        catch(error) {
            setErrors(error.response.data);
            console.error("Registration Error:", error.response.data);
        }
        finally {
            setLoading(false)
        }
    }

    


    return (
        <>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 p-5 rounded-2 bg-light-dark ">
                    <h3 className='text-light text-center mb-5'>Create an Account</h3>

                    <form onSubmit={handleRegistration}>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='form-control mt-3' placeholder='Username' />
                        <small> {errors.username && <div className='text-danger'>{errors.username}</div>} </small>

                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='form-control mt-3' placeholder='Email address' />
                        <small> {errors.email && <div className='text-danger'>{errors.email}</div>} </small>

                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='form-control mt-3' placeholder='Set Password' />
                        <small> {errors.password && <div className='text-danger'>{errors.password}</div>} </small>

                        {success && <div className='mt-4 alert alert-success'>Registration Successful</div>}


                        {loading ? (
                            <button type='submit' className='btn btn-success mt-5 d-block mx-auto' disable> <FontAwesomeIcon icon={faSpinner} spin /> Processing...</button>
                        ) : (
                            <button type='submit' className='btn btn-success mt-5 d-block mx-auto'>Register</button>
                        )}

                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Register