import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./VIewApplicants.css";
import axios from "../../../../components/axios";
import ApplicantsViewCard from "../../../../components/ApplicantsVIewCard/ApplicantsViewCard";
import Select from "react-select";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ViewApplicants() {
  const location = useLocation();
  const internship = location.state;
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const [applicantData, setApplicantData] = useState([]);

  const fetchData = async () => {
    axios({
      method: "get",
      url: `internship/opportunity_specific_applications?internshipId=${internship.internshipId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setApplicantData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="internship-view">
      <div className="internship-view-cnt">
        <h1 className="applicants-view-head">Applications</h1>
        <div className="applications-view-list mt-5">
          {applicantData.map((applicants) => (
            <ApplicantsViewCard data={applicants} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default ViewApplicants;
