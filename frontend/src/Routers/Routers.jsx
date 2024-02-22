import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import Explore from "../pages/Explore";
import Home from "../pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
    </Route>
  )
);

export default router;
