// import { createContext } from "react";

// export const AdminAuthContext = createContext();

// export const adminAuthReducer = (state, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       return { admin: action.payload };
//     case "LOGOUT":
//       return { admin: null };
//     default:
//       return state;
//   }
// };

// export const AdminAuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(adminAuthReducer, {
//     admin: null,
//   });

//   console.log("Auth Context state: ", state);

//   return (
//     <AdminAuthContext.Provider value={{ ...state, dispatch }}>
//       {children}
//     </AdminAuthContext.Provider>
//   );
// };
