// adminApi.js
import axiosInstance from "../axiosConfig";

const publicApi = axiosInstance.create({
  baseURL: axiosInstance.defaults.baseURL,
});

export const getGymOwners = async () => {
  try {
    const { data } = await publicApi.get("/explore");
    return data;
  } catch (error) {
    console.error("Error getting data:", error);
    throw error;
  }
};

export default publicApi;
