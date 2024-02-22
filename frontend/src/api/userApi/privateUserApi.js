import axiosInstance from "../axiosConfig";
import TokenService from "../../services/token";

const privateUserApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/users`,
});

privateUserApi.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from your storage (e.g., cookies, localStorage, etc.)
    // const jwtToken = TokenService.getLocal("adminInfo");
    const jwtToken = JSON.parse(TokenService.getUserLocal())?.token;

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

export const getUserProfile = async () => {
  try {
    const { data } = await privateUserApi.get("/profile");
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  firstname,
  middlename,
  lastname,
  dateOfBirth,
  contact,
  address
) => {
  try {
    const { data } = await privateUserApi.patch("/profile", {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      dateOfBirth: dateOfBirth,
      contact: contact,
      address: address,
    });
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getUserSubscription = async () => {
  try {
    const { data } = await privateUserApi.get("/subscriptions");
    return data;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw error;
  }
};

// export const updateUserSub = async (gymId, userId) => {
//   try {
//     const { data } = await privateUserApi.patch("/subscriptions", {
//       gymId: gymId,
//       userId: userId,
//     });
//     return data;
//   } catch (error) {
//     console.error("Error cancelling user subscription:", error);
//     throw error;
//   }
// };

export const getUserClasses = async () => {
  try {
    const { data } = await privateUserApi.get("/classes");
    return data;
  } catch (error) {
    console.error("Error fetching user classes:", error);
    throw error;
  }
};

export const getUserGyms = async () => {
  try {
    const { data } = await privateUserApi.get("/gyms");
    return data;
  } catch (error) {
    console.error("Error fetching gyms:", error);
    throw error;
  }
};

export const postUserJoinGym = async (plan, gymId, paymentImage) => {
  try {
    const { data } = await privateUserApi.post("/join", {
      plan: plan,
      gymId: gymId,
      paymentImage: paymentImage,
    });
    return data;
  } catch (error) {
    console.error("Error user join gym:", error);
    throw error;
  }
};

export const postUserJoinClass = async (classId) => {
  try {
    const { data } = await privateUserApi.post("/joinclass", {
      classId,
    });
    return data;
  } catch (error) {
    console.error("Error user join class:", error);
    throw error;
  }
};

export const postUserWithdrawClass = async (classId) => {
  try {
    const { data } = await privateUserApi.patch("/joinclass", {
      classId,
    });
    return data;
  } catch (error) {
    console.error("Error user withdraw class:", error);
    throw error;
  }
};

export const getUserAnnouncements = async () => {
  try {
    const { data } = await privateUserApi.get("/announcements");
    return data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

export const getUserReviews = async () => {
  try {
    const { data } = await privateUserApi.get("/reviews");
    return data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const submitUserReview = async (gymId, rating) => {
  try {
    const { data } = await privateUserApi.patch("/reviews", {
      gymId,
      rating,
    });
    return data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export default privateUserApi;
