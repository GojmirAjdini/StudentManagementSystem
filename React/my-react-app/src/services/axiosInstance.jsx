import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
});

let interceptorEnabled = true;

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!interceptorEnabled) {
      // If interceptor is disabled, just reject the error
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          'http://localhost:3000/admin/refresh-token',
          {},
          { withCredentials: true }
        );

        console.log('Token refreshed:', refreshResponse.data.message);

        // Retry original request after refreshing token
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Error refreshing access token', err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Function to disable the interceptor, to be called on logout
export function disableInterceptor() {
  interceptorEnabled = false;
}

export default axiosInstance;
