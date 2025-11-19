/* eslint-disable no-unused-vars */
import axios from "axios";


const baseURL = import.meta.env.VITE_BACKEND_BASE_API;



const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api/v1/'
    
    baseURL:baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})


// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config) {

        // console.log("Req without Headers", config);

        const accesstoken = localStorage.getItem('accessToken');  // This name 'accessToken' is taken from browser/Appplication/LocalStorage
        if(accesstoken) {
            config.headers['Authorization'] = `Bearer ${accesstoken}`
        }

        return config;

    }, 
    
    function (error) {
        
        return Promise.reject(error);
    }
)


// Response Interceptor
axiosInstance.interceptors.response.use(
    function(response) {
        return response

    }, 
    
    // Handle failed responses
    async function (error) {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry=true;

            const refreshToken = localStorage.getItem('refreshToken');
            try {
                const response = await axiosInstance.post('/token/refresh/', {refresh:refreshToken});
                // console.log("New Response=>",response.data);
                localStorage.setItem('accessToken', response.data.access);
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`
                return axiosInstance(originalRequest);
            }   
            catch(error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
)


export default axiosInstance;
