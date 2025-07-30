import axios from "axios"

const authAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_USERS_URL,
    withCredentials: true,
});

authAxios.interceptors.request.use(
    (config)=>{
      const accessToken = localStorage.getItem("accessToken")

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config
    },
    (error)=>{
        return Promise.reject(error);
    }
);

authAxios.interceptors.response.use(
    (response) => response, 
    async (error) => {
      if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login"; 
            return Promise.reject(error);
      }
      return Promise.reject(error);

    }
);

export default authAxios
