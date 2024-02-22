import axiosInstance from "../axiosConfig";
import TokenService from "../../services/token";

const privateAdminApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/admin`,
});

privateAdminApi.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from your storage (e.g., cookies, localStorage, etc.)
    // const jwtToken = TokenService.getLocal("adminInfo");
    const jwtToken = JSON.parse(TokenService.getAdminLocal()).token;

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

// export const getAdminProfile = async () => {
//   try {
//     const { data } = await privateAdminApi.get("/");
//     return data;
//   } catch (error) {
//     console.error("Error fetching admin profile:", error);
//     throw error;
//   }
// };

export const updateGymStatus = async (action, id) => {
  try {
    const { data } = await privateAdminApi.patch(`/owners/${action}`, {
      id: id,
    });
    return data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export default privateAdminApi;
