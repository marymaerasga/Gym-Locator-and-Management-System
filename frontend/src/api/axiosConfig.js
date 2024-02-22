import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://gymlocator.co/api"
      : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    // You can add common headers here
  },
});

export default instance;
