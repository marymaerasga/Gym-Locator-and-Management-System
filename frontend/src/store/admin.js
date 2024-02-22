// import useStore from "./store";

// const useAdmin = () => {
//   const { admin } = useStore();

//   const loginAdmin = async (email, password) => {
//     try {
//       const response = await fetch("/admin/auth/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: "zeemarq001@gmail.com",
//           password: "zee123",
//         }),
//       });

//       const data = await response.json();

//       // Update the admin state with the fetched data
//       //   setAdmin((state) => ({ admin: data }));

//       // Optionally, you can also save admin data to localStorage
//       localStorage.setItem("adminInfo", JSON.stringify(data));
//     } catch (error) {
//       console.error("Error logging in admin:", error);
//     }
//   };

//   const addAdmin = (newItem) => {
//     setState((state) => ({ admin: [...state.admin, newItem] }));
//   };

//   const updateAdmin = (index, updatedItem) => {
//     setState((state) => ({
//       admin: state.admin.map((item, i) => (i === index ? updatedItem : item)),
//     }));
//   };

//   const removeAdmin = (index) => {
//     setState((state) => ({
//       admin: state.admin.filter((_, i) => i !== index),
//     }));
//   };

//   return { admin, loginAdmin, addAdmin, updateAdmin, removeAdmin };
// };

// export default useAdmin;
