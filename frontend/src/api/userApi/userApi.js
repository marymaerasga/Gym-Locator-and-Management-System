// adminApi.js
import axiosInstance from "../axiosConfig";

const userApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/users`,
});

export const postLoginUser = async (email, password) => {
  try {
    const { data } = await userApi.post(
      "/auth",
      {
        email,
        password,
      }
      // { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const postRegisterUser = async (
  firstname,
  middlename,
  lastname,
  email,
  contact,
  address,
  dateOfBirth,
  plan,
  gender,
  password,
  gymId,
  paymentImage
) => {
  try {
    const { data } = await userApi.post("/register", {
      firstname,
      middlename,
      lastname,
      email,
      contact,
      address,
      dateOfBirth,
      plan,
      gender,
      password,
      gymId,
      paymentImage,
    });
    return data;
  } catch (error) {
    console.error("Error register user:", error);
    throw error;
  }
};

export default userApi;
