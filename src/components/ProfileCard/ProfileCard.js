import React, { useState } from "react";
import "./ProfileCard.css";
import avatarIcon from "../../assets/images/avatar.png";
import { useEffect } from "react";

function ProfileCard({ className, data }) {
  const [profileImg, setProfileImg] = useState(avatarIcon);

  useEffect(() => {
    if (data) {
      setProfileImg(data.profilePicPath);
    }
  }, [data]);
  return (
    <div
      className={`profile-main-card d-flex flex-column justify-content-around align-items-center ${className}`}
    >
      <img src={profileImg} alt="" />
      <div>
        <div className="name">
          {data.firstName} {data.lastName}
        </div>
        <div className="department">{data.department}</div>
        <div className="batch">
          {data.yearGraduation
            ? data.yearGraduation
            : data.expectedGraduationYear}{" "}
          Batch
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
