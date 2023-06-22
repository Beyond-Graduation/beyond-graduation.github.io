import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaUser } from "react-icons/fa";
import axios from "../../../components/axios";
import "./ProfilesView.css";
import ProfilesViewCard from "../../../components/ProfilesViewCard/ProfilesViewCard";
import { Link } from "react-router-dom";

function SimilarProfilesView() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const [similarStudents, setSimilarStudents] = useState([]);
  const [similarAlumni, setSimilarAlumni] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("user/get_similar_profiles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { similar_students, similar_alumni } = response.data;

        setSimilarStudents(similar_students);
        setSimilarAlumni(similar_alumni);
      } catch (error) {
        console.log("Error fetching similar profiles:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="profiles-view">
      <div className="profiles-view-cnt">
        <h1 className="profiles-view-head">Recommended Alumni Profiles</h1>
        <div className="profiles-view-list mt-5">
          {similarAlumni.map((alumni) => (

            <Link to={`/alumni-profile/${alumni.userId}`}>
              <ProfilesViewCard
                key={alumni.userId}
                data={alumni}
                icon={<FaUserGraduate />}
              />
            </Link>
          ))}
        </div>

        <h1 className="profiles-view-head mt-5">Recommended Student Profiles</h1>
        <div className="profiles-view-list mt-5">
          {similarStudents.map((student) => (
            <Link to={`/student-profile/${student.userId}`}>
            <ProfilesViewCard
              key={student.userId}
              data={student}
              icon={<FaUser />}
            />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimilarProfilesView;
