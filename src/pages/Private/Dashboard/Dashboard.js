import React, { useEffect } from "react";
import "./Dashboard.css";
import { isAuth } from "../../../auth/Auth";
import AlumniDashboard from "./AlumniDashboard";
import StudentDashboard from "./StudentDashboard";
import { useStateValue } from "../../../reducer/StateProvider";
import axios from "../../../components/axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userType =
      localStorage.getItem("userType") || sessionStorage.getItem("userType");
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

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
    if (location.state) {
      navigate(location.state.current);
    }
  }, [dispatch]);

  return userType === "admin" ? (
    <Navigate to="/admin" replace />
  ) : isAuth.userType === "alumni" ? (
    <AlumniDashboard />
  ) : (
    <StudentDashboard />
  );
}

export default Dashboard;
