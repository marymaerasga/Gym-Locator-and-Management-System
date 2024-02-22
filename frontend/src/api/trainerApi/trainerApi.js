import axiosInstance from "../axiosConfig";

const trainerApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/trainer`,
});

export const postLoginTrainer = async (email, password) => {
  try {
    const { data } = await trainerApi.post(
      "/auth",
      {
        email,
        password,
      }
      // { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error("Error logging in trainer:", error);
    throw error;
  }
};

export default trainerApi;
