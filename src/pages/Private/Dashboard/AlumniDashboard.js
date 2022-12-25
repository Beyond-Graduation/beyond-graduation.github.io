import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import avatarIcon from "../../../assets/images/avatar.png";
import DashboardCarousel from "../../../components/DashboardCarousel/DashboardCarousel";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import { Link } from "react-router-dom";
import { useStateValue } from "../../../reducer/StateProvider";
import axios from "../../../components/axios";
import { toast } from "react-toastify";

function AlumniDashboard() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const [studentData, setStudentData] = useState([]);
  const [alumniData, setAlumniData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [profileImg, setProfileImg] = useState(avatarIcon);
  const [myBlogs, setMyBlogs] = useState([]);

  const getMyBlogs = () => {
    var userBlogs = blogData.filter((x) => x.userId === userData.userId);
    setMyBlogs(userBlogs);
  };

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
    const fetchAlumniData = async () => {
      const token = localStorage.getItem("authKey");
      axios({
        method: "get",
        url: `alumni/alumni_list`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        setAlumniData(res.data);
      });
    };
    const fetchBlogData = async () => {
      const token = localStorage.getItem("authKey");
      axios({
        method: "get",
        url: "/blog",
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          setBlogData(res.data);
        })
        .catch((err) => {
          toast.error("Something went wrong!!");
        });
    };

    fetchBlogData();
    fetchAlumniData();
    fetchData();
  }, []);

  useEffect(() => {
    if (blogData.length > 0) getMyBlogs();
  }, [blogData]);

  useEffect(() => {
    setProfileImg(userData.profilePicPath);
  }, [userData]);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-heading d-flex align-items-center">
          <img src={profileImg} alt="" />
          <h1>Hi {userData.firstName},</h1>
        </div>
        <div className="dash-main-cnt">
          <div className="dash-main-left">
            <div className="carousel-container">
              <div className="carousel-heading">My Blogs</div>
              <DashboardCarousel
                type="blog"
                className="dash-sm-carousel"
                data={myBlogs}
                userData={alumniData}
                userType="alumni"
              />
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
        <div className="carousel-container">
          <div className="carousel-heading d-flex align-items-center justify-content-between mb-2">
            <span>Student Profiles</span>
            <Link to="/student-profiles">
              <span className="explore-btn">Explore</span>
            </Link>
          </div>
          <DashboardCarousel
            type="profile"
            className="dash-lg-carousel"
            cardCount={4}
            data={studentData}
            userType="student"
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
            data={blogData}
            userData={alumniData}
            cardCount={4}
            userType="alumni"
            create={false}
          />
        </div>
      </div>
    </div>
  );
}

export default AlumniDashboard;
