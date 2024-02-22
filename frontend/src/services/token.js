// import Cookies from "universal-cookie";
// const cookies = new Cookies();

class TokenService {
  // Admin Token Service
  getAdminLocal() {
    return localStorage.getItem("adminInfo");
  }

  setAdminLocal(token) {
    return localStorage.setItem("adminInfo", token);
  }

  removeAdminLocal() {
    return localStorage.removeItem("adminInfo");
  }

  // Gym Owner Token Service
  getOwnerLocal() {
    return localStorage.getItem("ownerInfo");
  }

  setOwnerLocal(token) {
    return localStorage.setItem("ownerInfo", token);
  }

  removeOwnerLocal() {
    return localStorage.removeItem("ownerInfo");
  }

  // User Token Service
  getUserLocal() {
    return localStorage.getItem("userInfo");
  }

  setUserLocal(token) {
    return localStorage.setItem("userInfo", token);
  }

  removeUserLocal() {
    return localStorage.removeItem("userInfo");
  }

  // Trainer Token Service
  getTrainerLocal() {
    return localStorage.getItem("trainerInfo");
  }

  setTrainerLocal(token) {
    return localStorage.setItem("trainerInfo", token);
  }

  removeTrainerLocal() {
    return localStorage.removeItem("trainerInfo");
  }
}

export default new TokenService();
