import React from "react";
import "./UnderConstruction.css";
import { IoIosConstruct } from "react-icons/io";

function UnderConstruction() {
  return (
    <div className="under-construction">
      <div className="d-flex align-items-center">
        <IoIosConstruct />
        <span>Under Construction</span>
      </div>
    </div>
  );
}

export default UnderConstruction;
