import React, { useState } from "react";
import "./DashProfileCard.css";
import avatarIcon from "../../../assets/images/avatar.png";
import { useEffect } from "react";

function DashProfileCard({ userData }) {
  const [profImg, setProfImg] = useState(avatarIcon);

  useEffect(() => {
    setProfImg(userData.profilePicPath);
  }, [userData]);

  return (
    <div className="d-prof-card">
      <div className="d-p-card-upper">
        <img src={profImg} alt="" />
      </div>
      <div className="d-p-card-lower d-flex flex-column justify-content-around">
        <div className="name">
          {userData.firstName} {userData.lastName}
        </div>
        <div className="department">{userData.department}</div>
        <div className="batch">
          {userData.yearGraduation
            ? userData.yearGraduation
            : userData.expectedGraduationYear}{" "}
          Batch
        </div>
      </div>
    </div>
  );
}

export default DashProfileCard;
