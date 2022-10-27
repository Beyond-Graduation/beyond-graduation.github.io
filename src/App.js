import React from "react";
import {
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
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
import About from "./pages/Public/About/About";
import AlumniProfilesView from "./pages/Private/Profiles/AlumniProfilesView";
import StudentProfilesView from "./pages/Private/Profiles/StudentProfilesView";
import AdminDashboard from "./pages/Private/Dashboard/AdminDashboard/AdminDashboard";

const WithNav = () => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px" }}>
        <Outlet />
      </div>
    </>
  );
};

const AdminDash = () => {
  return localStorage.getItem("userType") === "admin" ? (
    <AdminDashboard />
  ) : (
    <Navigate to="/" replace />
  );
};

const PrivateRoute = ({ comp: Component }) => {
  const userType = localStorage.getItem("userType");

  return userType === "admin" ? (
    <Navigate to="/admin" replace />
  ) : isAuth.checkAuth() === true ? (
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
    const userType = localStorage.getItem("userType");
    const token = localStorage.getItem("authKey");
    const userId = localStorage.getItem("userId");

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

    if (token && userId && userType !== "admin") {
      getData();
    }
  }, [dispatch]);

  return (
    <div className="App">
      <HashRouter>
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
          <Route path="/admin" element={<AdminDash />} />
          <Route element={<WithNav />}>
            <Route path="/intro" element={<RegisterRoute comp={Intro} />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute comp={Dashboard} />}
            />
            <Route path="/profile" element={<PrivateRoute comp={Profile} />} />
            <Route
              path="/alumni-profiles"
              element={<PrivateRoute comp={AlumniProfilesView} />}
            />
            <Route
              path="/student-profiles"
              element={<PrivateRoute comp={StudentProfilesView} />}
            />
            <Route path="/blogs" element={<PrivateRoute comp={BlogsView} />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<PublicRoute comp={Home} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
