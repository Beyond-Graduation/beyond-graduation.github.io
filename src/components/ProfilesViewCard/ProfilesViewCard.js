import React, { useEffect, useState } from "react";
import "./ProfilesViewCard.css";
import avatarIcon from "../../assets/images/avatar.png";

function ProfilesViewCard({ data }) {
  const [profileImg, setProfileImg] = useState(avatarIcon);

  useEffect(() => {
    setProfileImg(data.profilePicPath);
  }, [data]);

  return (
    <div className="profile-view-card-main d-flex align-items-center">
      <img src={profileImg} alt="" />
      <div className="prof-view-card-inner">
        <div className="pv-c-name">
          {data.firstName} {data.lastName}
        </div>
        <div className="pv-c-dept">{data.department}</div>
        <div className="pv-c-batch">
          {data.yearGraduation
            ? data.yearGraduation
            : data.expectedGraduationYear}{" "}
          Batch
        </div>
        <div className="pv-c-domain">{data.areasOfInterest.join(", ")}</div>
      </div>
    </div>
  );
}

export default ProfilesViewCard;
