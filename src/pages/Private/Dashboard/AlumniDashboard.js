import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import avatarIcon from "../../../assets/images/avatar.png";
import DashboardCarousel from "../../../components/DashboardCarousel/DashboardCarousel";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import { Link } from "react-router-dom";
import { useStateValue } from "../../../reducer/StateProvider";
import axios from "../../../components/axios";

function AlumniDashboard() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authKey");
      axios({
        method: "get",
        url: `student/student_list`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        setStudentData(res.data);
      });
    };

    fetchData();
  },[]);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-heading d-flex align-items-center">
          <img src={avatarIcon} alt="" />
          <h1>Hi {userData.firstName},</h1>
        </div>
        <div className="dash-main-cnt">
          <div className="dash-main-left">
            <div className="carousel-container">
              <div className="carousel-heading">Your Blogs</div>
              <DashboardCarousel type="blog" className="dash-sm-carousel" />
            </div>
            <div className="carousel-container">
              <div className="carousel-heading">Faculties</div>
              <DashboardCarousel
                type="profile"
                className="dash-sm-carousel"
                data={studentData}
              />
            </div>
          </div>
          <div className="dash-main-right">
            <Link to="/profile">
              <ProfileCard data={userData} />
            </Link>
          </div>
        </div>
        <div className="dash-nav-section d-flex align-items-center justify-content-center">
          <div>POST NEW INTERNSHIPS&nbsp;/ PROJECTS</div>
          <div>CREATE YOUR OWN BLOGS</div>
          <div>PROJECT PROGRESS</div>
        </div>
        <div className="carousel-container">
          <div className="carousel-heading d-flex align-items-center justify-content-between mb-2">
            <span>Student Profiles</span>
            <Link to="/profiles">
              <span className="explore-btn">Explore</span>
            </Link>
          </div>
          <DashboardCarousel
            type="profile"
            className="dash-lg-carousel"
            cardCount={4}
            data={studentData}
          />
        </div>
        <div className="carousel-container">
          <div className="carousel-heading d-flex align-items-center justify-content-between mb-2">
            <span>Blogs</span>
            <Link to="/blogs">
              <span className="explore-btn">Explore</span>
            </Link>
          </div>
          <DashboardCarousel
            type="blog"
            className="dash-lg-carousel"
            cardCount={4}
          />
        </div>
      </div>
    </div>
  );
}

export default AlumniDashboard;
