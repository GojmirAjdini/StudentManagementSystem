import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  async (config) => {
    
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    const token = accessToken ? accessToken.split('=')[1] : null;

    if (token) {

      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      try {
        const refreshResponse = await axios.get('http://localhost:3000/admin/admin/refresh-token', { withCredentials: true });

        const newAccessToken = refreshResponse.data.newAccessToken;

        console.log(refreshResponse.data.message);
        
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(error.config);
      } catch (err) {
        console.error('Error refreshing access token', err);
        
        window.location.href = '/login'; 
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
