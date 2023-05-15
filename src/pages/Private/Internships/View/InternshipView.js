import React, { useEffect, useState } from "react";
import { CgAttachment } from "react-icons/cg";
import axios from "../../../../components/axios";
import { TbNews } from "react-icons/tb";
import "./InternshipView.css";
import { Link } from "react-router-dom";

function InternshipView() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");
  const [internships, setInternships] = useState([]);

  const getData = async () => {
    await axios({
      method: "get",
      url: "internship/view_internships",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setInternships(res.data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="internship-view">
      <div className="internship-view-cnt">
        <div className="internship-heading">Internships</div>
        <div className="internship-cnt">
          {internships.map((internship, i) => {
            //var date = new Date(notice.dateUploaded);
            return (
              <div className="internship-view-card d-flex align-items-center mt-4">
                <div className="not-view-right">
                  <div className="title">
                    {i + 1}. {internship.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InternshipView;
