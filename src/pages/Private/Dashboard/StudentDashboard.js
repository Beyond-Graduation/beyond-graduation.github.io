import React, { useState } from "react";
import "./Dashboard.css";
import avatarIcon from "../../../assets/images/avatar.png";
import DashboardCarousel from "../../../components/DashboardCarousel/DashboardCarousel";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import { Link } from "react-router-dom";
import { useStateValue } from "../../../reducer/StateProvider";
import axios from "../../../components/axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

function StudentDashboard() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const [alumniData, setAlumniData] = useState([]);
  const [favAlumni, setFavAlumni] = useState([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [profileImg, setProfileImg] = useState(avatarIcon);

  useEffect(() => {
    const fetchData = async () => {
      const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
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
      const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
      axios({
        method: "get",
        url: "blog",
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
    fetchData();
  }, []);

  const getFavAlumniList = () => {
    const fav = alumniData.filter((alu) =>
      userData.favAlumId.includes(alu.userId)
    );
    setFavAlumni(fav);
  };

  const getBookmarkedBlogs = () => {
    const bookmarked = blogData.filter((blog) =>
      userData.bookmarkBlog.includes(blog.blogId)
    );
    setBookmarkedBlogs(bookmarked);
  };

  useEffect(() => {
    if (alumniData && userData.favAlumId?.length > 0) getFavAlumniList();
    if (blogData && userData.bookmarkBlog?.length > 0) getBookmarkedBlogs();
  }, [alumniData, blogData]);

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
        <div className="dash-main-cnt d-md-flex align-items-center">
          <div className="dash-main-left">
            <div className="carousel-container">
              <div className="carousel-heading">Favourite Profiles</div>
              <DashboardCarousel
                type="profile"
                className="dash-sm-carousel"
                data={favAlumni}
                userType="alumni"
                />
            </div>
            <div className="carousel-container">
              <div className="carousel-heading">Bookmarked Blogs</div>
              <DashboardCarousel
                type="blog"
                bookmark={true}
                className="dash-sm-carousel"
                data={bookmarkedBlogs}
                userData={alumniData}
              />
            </div>
          </div>
          <div className="dash-main-right">
            <Link to="/profile">
              <ProfileCard data={userData} />
            </Link>
          </div>
        </div>
        {/* <div className="dash-nav-section d-flex align-items-center justify-content-center">
          <div>Internships</div>
          <div>Projects</div>
          <div>Your Applications</div>
        </div> */}
        <div className="carousel-container">
          <div className="carousel-heading d-flex align-items-center justify-content-between mb-2">
            <span>Alumni Profiles</span>
            <Link to="/alumni-profiles">
              <span className="explore-btn">Explore</span>
            </Link>
          </div>
          <DashboardCarousel
            type="profile"
            className="dash-lg-carousel"
            cardCount={4}
            data={alumniData}
            userType="alumni"
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
            data={blogData}
            userData={alumniData}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
