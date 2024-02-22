// // user.js
// import useStore from "./store";

// const useUser = () => {
//   const { user } = useStore();

//   const loginUser = async () => {
//     // Simulate fetching data from an API
//     try {
//       const response = await fetch("https://api.example.com/user");
//       const data = await response.json();
//       setState((state) => ({ user: data }));
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const addUser = (newItem) => {
//     useStore.setState((state) => ({ user: [...state.user, newItem] }));
//   };

//   const updateUser = (index, updatedItem) => {
//     useStore.setState((state) => ({
//       user: state.user.map((item, i) => (i === index ? updatedItem : item)),
//     }));
//   };

//   const removeUser = (index) => {
//     useStore.setState((state) => ({
//       user: state.user.filter((_, i) => i !== index),
//     }));
//   };

//   return { user, addUser, updateUser, removeUser };
// };

// export default useUser;
