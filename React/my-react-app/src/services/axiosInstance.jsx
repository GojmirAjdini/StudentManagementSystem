import axios from 'axios';

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Your API base URL
  withCredentials: true, // Ensures cookies (including refresh token) are sent with the request
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the access token from cookies (browser automatically handles this)
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    const token = accessToken ? accessToken.split('=')[1] : null;

    if (token) {
      // Attach the access token to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiry and refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If access token is expired, try refreshing the token
      try {
        const refreshResponse = await axios.get('http://localhost:3000/admin/admin/refresh-token', { withCredentials: true });

        // If the refresh is successful, get the new access token from the response
        const newAccessToken = refreshResponse.data.newAccessToken;

        console.log(refreshResponse.data.message);
        // Retry the original request with the new access token
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Make the original request again
        return axiosInstance(error.config);
      } catch (err) {
        console.error('Error refreshing access token', err);
        // If refresh fails, log out or handle the error as necessary
        window.location.href = '/login'; // Example: redirect to login page
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
