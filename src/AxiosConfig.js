import axios from "axios";


const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});



export default axiosInstance