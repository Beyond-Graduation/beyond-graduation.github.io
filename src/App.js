import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
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
import UpdateProfile from "./pages/Private/UpdateProfile/UpdateProfile";
import CreateBlog from "./pages/Private/Blogs/CreateBlog";
import SingleBlog from "./pages/Private/Blogs/SingleBlog";
import ViewStudentProfile from "./pages/Private/Profile/ViewOtherProfile/ViewStudentProfile";
import ViewAlumniProfile from "./pages/Private/Profile/ViewOtherProfile/ViewAlumniProfile";
import NoticesView from "./pages/Private/GeneralNotices/NoticesView";
import PublishNotice from "./pages/Private/GeneralNotices/PublishNotice";
import Chats from "./pages/Private/Chats/Chats";
import ChangePassword from "./pages/Private/ChangePassword/ChangePassword";
import ResetPassword from "./pages/Public/ResetPassword/ResetPassword";
import InternshipPosting from "./pages/Private/Internships/Posting/InternshipPosting";
import InternshipApplication from "./pages/Private/Internships/Application/InternshipApplication";
import InternshipView from "./pages/Private/Internships/View/InternshipView";

const WithNav = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const AdminDash = () => {
  return localStorage.getItem("userType") === "admin" ||
    sessionStorage.getItem("userType") === "admin" ? (
    <AdminDashboard />
  ) : (
    <Navigate to="/" replace />
  );
};

const PrivateRoute = ({ comp: Component }) => {
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");

  return userType === "admin" ? (
    <Navigate to="/admin" replace />
  ) : isAuth.checkAuth() === true ? (
    <Component />
  ) : (
    // <Component />
    <Navigate to="/login" state={{ current: window.location.pathname }} />
  );
};

const PublicRoute = ({ comp: Component }) => {
  const location = useLocation();
  return isAuth.checkAuth() === true ? (
    location.state ? (
      <Navigate
        to="/dashboard"
        replace
        state={{ current: location.state.current }}
      />
    ) : (
      <Navigate to="/dashboard" replace />
    )
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

  const getData = async () => {
    const userType =
      localStorage.getItem("userType") || sessionStorage.getItem("userType");
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    await axios({
      method: "get",
      url:
        userType.toLowerCase() === "student"
          ? `student/student_details?userId=${userId}`
          : userType.toLowerCase() === "alumni"
          ? `alumni/alumni_details?userId=${userId}`
          : `admin/admin_details?userId=${userId}`,
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

  useEffect(() => {
    var sessionStorage_transfer = function (event) {
      if (!event) {
        event = window.event;
      } // ie suq
      if (!event.newValue) return; // do nothing if no value to work with
      if (event.key === "getSessionStorage") {
        // another tab asked for the sessionStorage -> send it
        localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
        // the other tab should now have it, so we're done with it.
        localStorage.removeItem("sessionStorage"); // <- could do short timeout as well.
      } else if (event.key === "sessionStorage" && !sessionStorage.length) {
        console.log("sample");
        // another tab sent data <- get it
        var data = JSON.parse(event.newValue);
        for (var key in data) {
          sessionStorage.setItem(key, data[key]);
        }
        var sessionStorageUpdatedEvent = new CustomEvent(
          "sessionStorageUpdated"
        );
        window.dispatchEvent(sessionStorageUpdatedEvent);
      }
    };

    // listen for changes to localStorage
    if (window.addEventListener) {
      window.addEventListener("storage", sessionStorage_transfer, false);
    } else {
      window.attachEvent("onstorage", sessionStorage_transfer);
    }

    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    if (token) getData();
    const handleSessionStorageUpdated = () => {
      getData();
    };

    // Ask other tabs for session storage (this is ONLY to trigger event)
    if (!sessionStorage.length) {
      localStorage.setItem("getSessionStorage", "foobar");
      localStorage.removeItem("getSessionStorage", "foobar");
    }

    window.addEventListener(
      "sessionStorageUpdated",
      handleSessionStorageUpdated
    );
    return () =>
      window.removeEventListener(
        "sessionStorageUpdated",
        handleSessionStorageUpdated
      );
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
          <Route
            exact
            path="/reset_password/:token"
            element={<PublicRoute comp={ResetPassword} />}
          />
          <Route path="/admin/:func" element={<AdminDash />} />
          <Route path="/admin" element={<AdminDash />} />
          <Route element={<WithNav />}>
            <Route path="/intro" element={<RegisterRoute comp={Intro} />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute comp={Dashboard} />}
            />
            <Route path="/profile" element={<PrivateRoute comp={Profile} />} />
            <Route
              path="/change_password"
              element={<PrivateRoute comp={ChangePassword} />}
            />
            <Route
              path="/update"
              element={<PrivateRoute comp={UpdateProfile} />}
            />
            <Route
              path="/alumni-profiles"
              element={<PrivateRoute comp={AlumniProfilesView} />}
            />
            <Route
              path="/student-profiles"
              element={<PrivateRoute comp={StudentProfilesView} />}
            />
            <Route
              path="/student-profile/:userId"
              element={<PrivateRoute comp={ViewStudentProfile} />}
            />
            <Route
              path="/alumni-profile/:userId"
              element={<PrivateRoute comp={ViewAlumniProfile} />}
            />
            <Route path="/blogs" element={<PrivateRoute comp={BlogsView} />} />
            <Route
              path="/blogs/create"
              element={<PrivateRoute comp={CreateBlog} />}
            />
            <Route
              path="/blogs/:blogId"
              element={<PrivateRoute comp={SingleBlog} />}
            />
            <Route
              path="/notices/publish"
              element={<PrivateRoute comp={PublishNotice} />}
            />
            <Route
              path="/notices"
              element={<PrivateRoute comp={NoticesView} />}
            />
            <Route
              path="/internships/post"
              element={<PrivateRoute comp={InternshipPosting} />}
            />
            <Route
              path="/internships/apply/:internshipId"
              element={<PrivateRoute comp={InternshipApplication} />}
            />

            <Route
              path="/internships/viewall"
              element={<PrivateRoute comp={InternshipView} />}
            />
            <Route
              path="/chats/:chatId"
              element={<PrivateRoute comp={Chats} />}
            />
            <Route path="/chats" element={<PrivateRoute comp={Chats} />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<PublicRoute comp={Home} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
