import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Admin from "./pages/Admin";
import AdminDashboard from "./layout/Admin/AdminDashboard";
import AdminGymManage from "./layout/Admin/AdminGymManage";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// import GymSignUpDetails from "./pages/GymSignUpDetails";
import GymOwnerSignUp from "./pages/GymOwnerSignUp";
import GymOwnerLogin from "./pages/GymOwnerLogin";
import GymOwner from "./pages/GymOwner";
import GymOwnerDashboard from "./layout/Owner/GymOwnerDashboard";
import GymOwnerProfile from "./layout/Owner/GymOwnerProfile";
import GymOwnerMemberManagement from "./layout/Owner/GymOwnerMemberManagement";
import GymOwnerAnnouncement from "./layout/Owner/GymOwnerAnnouncement";
import GymOwnerClasses from "./layout/Owner/GymOwnerClasses";
import GymOwnerAmenities from "./layout/Owner/GymOwnerAmenities";
import GymOwnerDetails from "./layout/Owner/GymOwnerDetails";
import GymOwnerEquipments from "./layout/Owner/GymOwnerEquipments";
import GymOwnerPlans from "./layout/Owner/GymOwnerPlans";
import GymOwnerServices from "./layout/Owner/GymOwnerServices";
import GymOwnerTrainers from "./layout/Owner/GymOwnerTrainers";

import User from "./pages/User";
import UserDashboard from "./layout/UserLayout/UserDashboard";
import UserProfile from "./layout/UserLayout/UserProfile";
import UserBookings from "./layout/UserLayout/UserBookings";
import UserClasses from "./layout/UserLayout/UserClasses";
import UserAnnouncements from "./layout/UserLayout/UserAnnouncements";
import UserLogin from "./pages/UserLogin";
import UserSubscriptions from "./layout/UserLayout/UserSubscriptions";
import UserReviews from "./layout/UserLayout/UserReviews";

import Trainer from "./pages/Trainer";
import TrainerLogin from "./pages/TrainerLogin";
import TrainerDashboard from "./layout/TrainerLayout/TrainerDashboard";
import TrainerProfile from "./layout/TrainerLayout/TrainerProfile";
import TrainerBookings from "./layout/TrainerLayout/TrainerBookings";

import GuardRoute from "./privateRoute/GuardRoute";
import PrivateRoute from "./privateRoute/PrivateRoute";
import TrainerClasses from "./layout/TrainerLayout/TrainerClasses";

const App = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <PrivateRoute clientInfo="trainerInfo" navigateRoute="/trainer" />
        }
      >
        <Route
          path=""
          element={
            <PrivateRoute clientInfo="adminInfo" navigateRoute="/admin" />
          }
        >
          <Route
            path=""
            element={
              <PrivateRoute clientInfo="ownerInfo" navigateRoute="/gymowner" />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />

            <Route
              path=""
              element={
                <PrivateRoute clientInfo="userInfo" navigateRoute="/user" />
              }
            >
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/gym/signup" element={<GymOwnerSignUp />} />
              <Route path="/gym/login" element={<GymOwnerLogin />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route path="/trainerlogin" element={<TrainerLogin />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route
        path=""
        element={
          <PrivateRoute clientInfo="trainerInfo" navigateRoute="/trainer" />
        }
      >
        <Route
          path=""
          element={
            <GuardRoute
              clientInfo="adminInfo"
              navigateLoginRoute="/adminlogin"
            />
          }
        >
          <Route
            path=""
            element={
              <PrivateRoute clientInfo="ownerInfo" navigateRoute="/gymowner" />
            }
          >
            <Route
              path=""
              element={
                <PrivateRoute clientInfo="userInfo" navigateRoute="/user" />
              }
            >
              <Route path="/admin" element={<Admin />}>
                <Route index={true} element={<AdminDashboard />} />
                <Route path="manage" element={<AdminGymManage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Gym Owner Routes */}
      <Route
        path=""
        element={
          <PrivateRoute clientInfo="trainerInfo" navigateRoute="/trainer" />
        }
      >
        <Route
          path=""
          element={
            <PrivateRoute clientInfo="adminInfo" navigateRoute="/admin" />
          }
        >
          <Route
            path=""
            element={
              <PrivateRoute clientInfo="userInfo" navigateRoute="/user" />
            }
          >
            <Route
              path=""
              element={
                <GuardRoute
                  clientInfo="ownerInfo"
                  navigateLoginRoute="/gym/login"
                />
              }
            >
              <Route path="/gymowner" element={<GymOwner />}>
                <Route index={true} element={<GymOwnerDashboard />} />
                <Route path="profile" element={<GymOwnerProfile />} />
                <Route path="member" element={<GymOwnerMemberManagement />} />
                <Route path="announcement" element={<GymOwnerAnnouncement />} />
                <Route path="classes" element={<GymOwnerClasses />} />
                <Route path="amenities" element={<GymOwnerAmenities />} />
                <Route path="details" element={<GymOwnerDetails />} />
                <Route path="equipments" element={<GymOwnerEquipments />} />
                <Route path="plans" element={<GymOwnerPlans />} />
                <Route path="services" element={<GymOwnerServices />} />
                <Route path="trainers" element={<GymOwnerTrainers />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      {/* User Routes */}
      <Route
        path=""
        element={
          <PrivateRoute clientInfo="trainerInfo" navigateRoute="/trainer" />
        }
      >
        <Route
          path=""
          element={
            <PrivateRoute clientInfo="adminInfo" navigateRoute="/admin" />
          }
        >
          <Route
            path=""
            element={
              <PrivateRoute clientInfo="ownerInfo" navigateRoute="/gymowner" />
            }
          >
            <Route
              path=""
              element={
                <GuardRoute
                  clientInfo="userInfo"
                  navigateLoginRoute="/userlogin"
                />
              }
            >
              <Route path="/user" element={<User />}>
                {/* <Route index={true} element={<UserDashboard />} /> */}
                <Route
                  index={true}
                  // path="profile"
                  element={<UserProfile />}
                />
                <Route path="classes" element={<UserClasses />} />
                {/* <Route path="bookings" element={<UserBookings />} /> */}
                <Route path="subscriptions" element={<UserSubscriptions />} />
                <Route path="announcements" element={<UserAnnouncements />} />
                <Route path="reviews" element={<UserReviews />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Trainer Routes */}
      <Route
        path=""
        element={<PrivateRoute clientInfo="adminInfo" navigateRoute="/admin" />}
      >
        <Route
          path=""
          element={<PrivateRoute clientInfo="userInfo" navigateRoute="/user" />}
        >
          <Route
            path=""
            element={
              <PrivateRoute clientInfo="ownerInfo" navigateRoute="/gymowner" />
            }
          >
            <Route
              path=""
              element={
                <GuardRoute
                  clientInfo="trainerInfo"
                  navigateLoginRoute="/trainerlogin"
                />
              }
            >
              <Route path="/trainer" element={<Trainer />}>
                <Route index={true} element={<TrainerClasses />} />
                {/* <Route index={true} element={<TrainerDashboard />} /> */}
                {/* <Route path="profile" element={<TrainerProfile />} />
            <Route path="bookings" element={<TrainerBookings />} /> */}
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
