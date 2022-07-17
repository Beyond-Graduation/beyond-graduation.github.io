import React from "react";
import "./Dashboard.css";
import avatarIcon from "../../../assets/images/avatar.png";
import DashboardCarousel from "../../../components/DashboardCarousel/DashboardCarousel";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-heading d-flex align-items-center">
          <img src={avatarIcon} alt="" />
          <h1>Hi Student,</h1>
        </div>
        <div className="dash-main-cnt">
          <div className="dash-main-left">
            <div className="carousel-container">
              <div className="carousel-heading">Favourite Profiles</div>
              <DashboardCarousel className="dash-sm-carousel" />
            </div>
            <div className="carousel-container">
              <div className="carousel-heading">Bookmarked Blogs</div>
              <DashboardCarousel className="dash-sm-carousel" />
            </div>
          </div>
          <div className="dash-main-right">
            <ProfileCard />
          </div>
        </div>
        <div className="dash-nav-section d-flex align-items-center justify-content-center">
          <div>Internships</div>
          <div>Projects</div>
          <div>Your Applications</div>
        </div>
        <div className="carousel-container">
          <div className="carousel-heading">Alumni Profiles</div>
          <DashboardCarousel className="dash-lg-carousel" cardCount={4} />
        </div>
        <div className="carousel-container">
          <div className="carousel-heading">Blogs</div>
          <DashboardCarousel className="dash-lg-carousel" cardCount={4} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
