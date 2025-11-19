/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'

// import axios from 'axios'

import axiosInstance from '../../axiosInstance';

const Dashboard = () => {

    // const accesstoken = localStorage.getItem('accessToken');  // This name 'accessToken' is taken from browser/Appplication/LocalStorage

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                // const response = await axiosInstance.get('protected-view/', {
                //     // headers: {
                //     //     Authorization: `Bearer ${accesstoken}`
                //     // }
                // })
                const response = await axiosInstance.get('protected-view/');
                // console.log('Success =>', response.data);
            }
            catch(error) {
                console.error('Error while fetching data =>', error);
            }
        }

        fetchProtectedData();
    }, [])

    return (
        <div className="text-light container">Dashboard</div>
    )
}

export default Dashboard