// adminApi.js
import axiosInstance from "../axiosConfig";

const ownerApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/gymowner`,
});

export const postLoginOwner = async (email, password) => {
  try {
    const { data } = await ownerApi.post(
      "/auth",
      {
        email,
        password,
      }
      // { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error("Error logging in owner:", error);
    throw error;
  }
};

export const postRegisterOwner = async (
  firstname,
  middlename,
  lastname,
  email,
  password,
  gymname,
  contact,
  address,
  gymLocation,
  gcashNumber,
  description,
  startday,
  endday,
  opentime,
  closetime,
  gymImage,
  permitImage
) => {
  try {
    const { data } = await ownerApi.post("/register", {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      email: email,
      password: password,
      gymname: gymname,
      contact: contact,
      address: address,
      gymLocation: gymLocation,
      gcashNumber: gcashNumber,
      description: description,
      startday: startday,
      endday: endday,
      opentime: opentime,
      closetime: closetime,
      gymImage: gymImage,
      permitImage: permitImage,
    });
    return data;
  } catch (error) {
    console.error("Error registering owner", error);
    throw error;
  }
};

export const postLogoutOwner = async () => {
  try {
    const { data } = await adminApi.post("/logout");
    return data;
  } catch (error) {
    console.error("Error logging out owner:", error);
    throw error;
  }
};

export default ownerApi;
