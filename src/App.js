import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { isAuth } from "./auth/Auth";
import Home from "./pages/Public/Home/Home";
import Login from "./pages/Public/Login/Login";
import Register from "./pages/Public/Register/Register";
import Intro from "./pages/Private/IntroScreen/Intro";
import Dashboard from "./pages/Private/Dashboard/Dashboard";
import Profile from "./pages/Private/Profile/Profile";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import axios from "./components/axios";
import { useStateValue } from "./reducer/StateProvider";
import BlogsView from "./pages/Private/Blogs/BlogsView";
import ProfilesView from "./pages/Private/Profiles/ProfilesView";

const WithNav = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const PrivateRoute = ({ comp: Component }) => {
  return isAuth.checkAuth() === true ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = ({ comp: Component }) => {
  return isAuth.checkAuth() === true ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Component />
  );
};

const RegisterRoute = ({ comp: Component }) => {
  return isAuth.registering === true ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  const [{ userData, userId }, dispatch] = useStateValue();

  useEffect(() => {
    const token = localStorage.getItem("authKey");
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    const getData = async () => {
      await axios({
        method: "get",
        url:
          userType.toLowerCase() === "student"
            ? `student/student_details?userId=${userId}`
            : `alumni/alumni_details?userId=${userId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      }).then((res) => {
        if (res.status === 200) {
          dispatch({
            type: "SET_USER_DATA",
            item: res.data,
          });
          isAuth.userType = res.data.__t.toLowerCase();
        }
      });
    };

    if (token && userId) {
      getData();
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
        <Routes>
          <Route exact path="/login" element={<PublicRoute comp={Login} />} />
          <Route path="/register" element={<PublicRoute comp={Register} />} />
          <Route element={<WithNav />}>
            <Route path="/intro" element={<RegisterRoute comp={Intro} />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute comp={Dashboard} />}
            />
            <Route path="/profile" element={<PrivateRoute comp={Profile} />} />
            <Route
              path="/profiles"
              element={<PrivateRoute comp={ProfilesView} />}
            />
            <Route path="/blogs" element={<PrivateRoute comp={BlogsView} />} />
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
