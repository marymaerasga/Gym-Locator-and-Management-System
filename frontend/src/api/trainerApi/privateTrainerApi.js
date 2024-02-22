import axiosInstance from "../axiosConfig";
import TokenService from "../../services/token";

const privateTrainerApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/trainer`,
});

privateTrainerApi.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from your storage (e.g., cookies, localStorage, etc.)
    // const jwtToken = TokenService.getLocal("adminInfo");
    const jwtToken = JSON.parse(TokenService.getTrainerLocal())?.token;

    // If the token is available, add it to the Authorization header
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export const getTrainerClasses = async () => {
  try {
    const { data } = await privateTrainerApi.get("/classes");
    return data;
  } catch (error) {
    console.error("Error fetching trainer classes:", error);
    throw error;
  }
};
