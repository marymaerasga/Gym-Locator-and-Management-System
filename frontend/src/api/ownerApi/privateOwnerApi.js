import axiosInstance from "../axiosConfig";
import TokenService from "../../services/token";

const privateOwnerApi = axiosInstance.create({
  baseURL: `${axiosInstance.defaults.baseURL}/gymowner`,
});

privateOwnerApi.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from your storage (e.g., cookies, localStorage, etc.)
    // const jwtToken = TokenService.getLocal("adminInfo");
    const jwtToken = JSON.parse(TokenService.getOwnerLocal()).token;

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

export const getOwnerProfile = async () => {
  try {
    const { data } = await privateOwnerApi.get("/profile");
    return data;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

export const updateOwnerProfile = async (
  firstname,
  middlename,
  lastname,
  email
) => {
  try {
    const { data } = await privateOwnerApi.put("/profile", {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      email: email,
    });
    return data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const getMembers = async () => {
  try {
    const { data } = await privateOwnerApi.get("/dashboard");
    return data;
  } catch (error) {
    console.error("Error getting members:", error);
    throw error;
  }
};

export const getGymDetails = async () => {
  try {
    const { data } = await privateOwnerApi.get("/gymdetails");
    return data;
  } catch (error) {
    console.error("Error getting gym details:", error);
    throw error;
  }
};

export const updateGymDetails = async (
  // gymname,
  address,
  contact,
  description,
  startday,
  endday,
  opentime,
  closetime
) => {
  try {
    const { data } = await privateOwnerApi.put("/gymdetails", {
      // gymname: gymname,
      address: address,
      contact: contact,
      description: description,
      startday: startday,
      endday: endday,
      opentime: opentime,
      closetime: closetime,
    });
    return data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

// Gym Services API //

export const getGymServices = async () => {
  try {
    const { data } = await privateOwnerApi.get("/services");
    return data;
  } catch (error) {
    console.error("Error getting gym services:", error);
    throw error;
  }
};

export const addGymServices = async (
  serviceName,
  description,
  serviceImage
) => {
  try {
    const { data } = await privateOwnerApi.post("/services", {
      serviceName: serviceName,
      description: description,
      serviceImage: serviceImage,
    });
    return data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

export const updateGymServices = async (
  id,
  serviceName,
  description,
  serviceImage,
  publicId
) => {
  try {
    const { data } = await privateOwnerApi.patch("/services", {
      id: id,
      serviceName: serviceName,
      description: description,
      serviceImage: serviceImage,
      publicId: publicId,
    });
    return data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteGymService = async (id, publicId) => {
  try {
    const { data } = await privateOwnerApi.delete("/services", {
      data: { id, publicId },
    });
    return data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// Amenities API

export const getGymAmenities = async () => {
  try {
    const { data } = await privateOwnerApi.get("/amenity");
    return data;
  } catch (error) {
    console.error("Error getting gym amenities:", error);
    throw error;
  }
};

export const addGymAmenities = async (
  amenityName,
  description,
  amenityImage
) => {
  try {
    const { data } = await privateOwnerApi.post("/amenity", {
      amenityName: amenityName,
      description: description,
      amenityImage: amenityImage,
    });
    return data;
  } catch (error) {
    console.error("Error adding amenity:", error);
    throw error;
  }
};

export const updateGymAmenities = async (
  id,
  amenityName,
  description,
  amenityImage,
  publicId
) => {
  try {
    const { data } = await privateOwnerApi.patch("/amenity", {
      id: id,
      amenityName: amenityName,
      description: description,
      amenityImage: amenityImage,
      publicId: publicId,
    });
    return data;
  } catch (error) {
    console.error("Error updating amenity:", error);
    throw error;
  }
};

export const deleteGymAmenity = async (id, publicId) => {
  try {
    const { data } = await privateOwnerApi.delete("/amenity", {
      data: { id, publicId },
    });
    return data;
  } catch (error) {
    console.error("Error deleting amenity:", error);
    throw error;
  }
};

// Equipments API

export const getGymEquipments = async () => {
  try {
    const { data } = await privateOwnerApi.get("/equipments");
    return data;
  } catch (error) {
    console.error("Error getting gym equipments:", error);
    throw error;
  }
};

export const addGymEquipments = async (
  equipmentName,
  description,
  equipmentImage
) => {
  try {
    const { data } = await privateOwnerApi.post("/equipments", {
      equipmentName: equipmentName,
      description: description,
      equipmentImage: equipmentImage,
    });
    return data;
  } catch (error) {
    console.error("Error adding equipment:", error);
    throw error;
  }
};

export const updateGymEquipments = async (
  id,
  equipmentName,
  description,
  equipmentImage,
  publicId
) => {
  try {
    const { data } = await privateOwnerApi.patch("/equipments", {
      id: id,
      equipmentName: equipmentName,
      description: description,
      equipmentImage: equipmentImage,
      publicId: publicId,
    });
    return data;
  } catch (error) {
    console.error("Error updating equipment:", error);
    throw error;
  }
};

export const deleteGymEquipment = async (id, publicId) => {
  try {
    const { data } = await privateOwnerApi.delete("/equipments", {
      data: { id, publicId },
    });
    return data;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error;
  }
};

// Announcement API

export const getGymAnnouncements = async () => {
  try {
    const { data } = await privateOwnerApi.get("/announcements");
    return data;
  } catch (error) {
    console.error("Error getting gym announcements:", error);
    throw error;
  }
};

export const addGymAnnouncements = async (announcement) => {
  try {
    const { data } = await privateOwnerApi.post("/announcements", {
      announcement: announcement,
    });
    return data;
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw error;
  }
};

export const updateGymAnnouncements = async (announcement, id) => {
  try {
    const { data } = await privateOwnerApi.put("/announcements", {
      announcement: announcement,
      id: id,
    });
    return data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

export const deleteGymAnnouncement = async (id) => {
  try {
    const { data } = await privateOwnerApi.delete("/announcements", {
      data: { id },
    });
    return data;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error;
  }
};

// Plans API

export const getGymPlans = async () => {
  try {
    const { data } = await privateOwnerApi.get("/plans");
    return data;
  } catch (error) {
    console.error("Error getting gym plans:", error);
    throw error;
  }
};

export const addGymPlans = async (planName, duration, amount) => {
  try {
    const { data } = await privateOwnerApi.post("/plans", {
      planName: planName,
      duration: duration,
      amount: amount,
    });
    return data;
  } catch (error) {
    console.error("Error adding plan:", error);
    throw error;
  }
};

export const updateGymPlans = async (id, planName, duration, amount) => {
  try {
    const { data } = await privateOwnerApi.put("/plans", {
      id: id,
      planName: planName,
      duration: duration,
      amount: amount,
    });
    return data;
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};

export const deleteGymPlan = async (id) => {
  try {
    const { data } = await privateOwnerApi.delete("/plans", {
      data: { id },
    });
    return data;
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
};

// Trainers API

export const getGymTrainers = async () => {
  try {
    const { data } = await privateOwnerApi.get("/trainers");
    return data;
  } catch (error) {
    console.error("Error getting gym trainers:", error);
    throw error;
  }
};

export const addGymTrainers = async (
  firstname,
  middlename,
  lastname,
  email,
  contact,
  address,
  dateOfBirth,
  gender,
  certifications,
  specialties,
  yearsOfExperience,
  biography,
  password
) => {
  try {
    const { data } = await privateOwnerApi.post("/trainers", {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      email: email,
      contact: contact,
      address: address,
      dateOfBirth: dateOfBirth,
      gender: gender,
      certifications: certifications,
      specialties: specialties,
      yearsOfExperience: yearsOfExperience,
      biography: biography,
      password: password,
    });
    return data;
  } catch (error) {
    console.error("Error adding trainer:", error);
    throw error;
  }
};

export const deleteGymTrainer = async (id) => {
  try {
    const { data } = await privateOwnerApi.delete("/trainers", {
      data: { id },
    });
    return data;
  } catch (error) {
    console.error("Error deleting trainer:", error);
    throw error;
  }
};

// Classes API

export const getGymClasses = async () => {
  try {
    const { data } = await privateOwnerApi.get("/classes");
    return data;
  } catch (error) {
    console.error("Error getting gym classes:", error);
    throw error;
  }
};

export const addGymClass = async (
  classname,
  instructor,
  instructorId,
  date,
  starttime,
  endtime,
  capacity,
  description,
  equipment
) => {
  try {
    const { data } = await privateOwnerApi.post("/classes", {
      classname: classname,
      instructor: instructor,
      instructorId: instructorId,
      date: date,
      starttime: starttime,
      endtime: endtime,
      capacity: capacity,
      description: description,
      equipment: equipment,
    });
    return data;
  } catch (error) {
    console.error("Error adding gym class:", error);
    throw error;
  }
};

export const updateGymClass = async (
  id,
  classname,
  instructor,
  instructorId,
  date,
  starttime,
  endtime,
  capacity,
  description,
  equipment
) => {
  try {
    const { data } = await privateOwnerApi.patch("/classes", {
      id: id,
      classname: classname,
      instructor: instructor,
      instructorId: instructorId,
      date: date,
      starttime: starttime,
      endtime: endtime,
      capacity: capacity,
      description: description,
      equipment: equipment,
    });
    return data;
  } catch (error) {
    console.error("Error updating gym class:", error);
    throw error;
  }
};

export const deleteGymClass = async (classId, instructorId) => {
  try {
    const { data } = await privateOwnerApi.delete("/classes", {
      data: { classId, instructorId },
    });
    return data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

// Members API

export const getGymMembers = async () => {
  try {
    const { data } = await privateOwnerApi.get("/members");
    return data;
  } catch (error) {
    console.error("Error getting gym members:", error);
    throw error;
  }
};

export const postAddNewMember = async (
  firstname,
  middlename,
  lastname,
  email,
  contact,
  address,
  dateOfBirth,
  plan,
  gender,
  password
) => {
  try {
    const { data } = await privateOwnerApi.post("/members", {
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
    });
    return data;
  } catch (error) {
    console.error("Error register user:", error);
    throw error;
  }
};

// Get Own Gym Infos

export const getMyGym = async () => {
  try {
    const { data } = await privateOwnerApi.get("/ownergym");
    return data;
  } catch (error) {
    console.error("Error getting owner's gym", error);
    throw error;
  }
};

export const updatePendingMember = async (userId, action) => {
  try {
    const { data } = await privateOwnerApi.patch("/memberstatus", {
      userId: userId,
      action: action,
    });
    return data;
  } catch (error) {
    console.error("Error updating member status:", error);
    throw error;
  }
};

export default privateOwnerApi;
