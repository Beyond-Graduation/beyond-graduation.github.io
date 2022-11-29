import React from "react";
import { toast } from "react-toastify";
import axios from "../../axios";
import "./AlumniVerification.css";

function AlumniVerification({ pending, getData }) {
  const token = localStorage.getItem("authKey");

  const approveAlumni = async (userId) => {
    // console.log(userId);
    await axios({
      method: "post",
      url: "admin/alumni_approve",
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: {
        userId: userId,
      },
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Alumni Approved");
        getData();
      }
    });
  };

  return (
    <div>
      <div className="admin-main-head">Pending Alumni Verification</div>
      <div className="pending-container">
      {pending.length !== 0 ? (
          pending.map((alu) => (
            <div className="pending-card">
              <div className="p-card-top">
                <div className="p-name">
                  {alu.firstName} {alu.lastName}
                </div>
                <div className="p-department">{alu.department}</div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="d-flex">
                    <div className="p-degree p-field">
                      <span>Degree:</span> {alu.degree}
                    </div>
                    <div className="ms-5 p-yearGrad p-field">
                      <span>Year of Graduation:</span> {alu.yearGraduation}
                    </div>
                  </div>
                  <div className="p-email p-field">
                    <span>Email:</span> {alu.email}
                  </div>
                </div>
                <div
                  className="approve-btn"
                  onClick={() => approveAlumni(alu.userId)}
                >
                  Approve
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-pending">No Pending Verifications</div>
        )}
      </div>
    </div>
  );
}

export default AlumniVerification;
