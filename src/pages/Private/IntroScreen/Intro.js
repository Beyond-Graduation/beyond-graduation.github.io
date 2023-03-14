import React from "react";
import "./Intro.css";
import StudentRegistration from "./StudentRegistration";
import AluminiRegistration from "./AlumniRegistration";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Intro() {
  const location = useLocation();

  if (location.state.userType === "student")
    return <StudentRegistration state={location.state} />;
  else if (location.state.userType === "alumni")
    return <AluminiRegistration state={location.state} />;
}

export default Intro;
