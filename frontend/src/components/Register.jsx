import React, { useState } from 'react';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'



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
        
        const userData = {
            username, email, password
        }

        // console.log(userData);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData);
            console.log(response.data);

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