import React from "react";
import "./VIewApplicants.css";
import { useLocation } from "react-router-dom";

function ViewApplicants() {
  const location = useLocation();

  const internship = location.state;

  console.log(internship);
  return (
    <div className="internship-view">
      <div className="internship-view-cnt"></div>
    </div>
  );
}

export default ViewApplicants;
