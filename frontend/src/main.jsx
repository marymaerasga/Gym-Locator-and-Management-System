import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
// import router from "./Routers/Routers.jsx";
import theme from "./styles/theme.js";
// import store from "./store/store.js";
import { Provider } from "react-redux";
import "./styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.jsx";
// import { AdminAuthContextProvider } from "./context/adminAuthContext.js";

const client = new QueryClient();
//   {
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//     },
//   },
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      {/* <AdminAuthContextProvider> */}
      {/* <Provider store={store}> */}
      <ChakraProvider theme={theme}>
        <Router>
          <App />
        </Router>

        {/* <RouterProvider router={router} /> */}
      </ChakraProvider>
      {/* </Provider> */}
      {/* </AdminAuthContextProvider> */}
    </QueryClientProvider>
  </React.StrictMode>
);
