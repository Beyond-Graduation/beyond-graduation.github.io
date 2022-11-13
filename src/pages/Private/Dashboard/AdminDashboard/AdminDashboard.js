import React, { useEffect, useRef, useState } from "react";
import "./AdminDashboard.css";
import avatarIcon from "../../../../assets/images/avatar.png";
import { FaPowerOff } from "react-icons/fa";
import axios from "../../../../components/axios";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../../../auth/Auth";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const ref = useRef();
  const checkRef = useRef();
  const overlayRef = useRef();
  const [pending, setPending] = useState([]);
  const token = localStorage.getItem("authKey");

  const handleLogout = () => {
    isAuth.logout();
    navigate("/");
  };

  const approveAlumni = async (userId) => {
    // console.log(userId);
    await axios({
      method: "post",
      url: "admin/approve",
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

  const getData = async () => {
    await axios({
      method: "get",
      url: "admin/pending_alumni_list",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setPending(res.data);
        // console.log(res.datanod)
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="admin-dash">
      <div className="navbar-main d-flex align-items-center justify-content-between">
        <Link to="/" className="nav-logo">
          BeGrad
        </Link>
        <div className="d-flex align-items-center navbar-links">
          <Link to="/">
            <div className="nav-link">Home</div>
          </Link>
          <label htmlFor="profile-btn" className="nav-link" ref={ref}>
            <div className="profile-btn">
              <input id="profile-btn" type="checkbox" ref={checkRef} />
              <div>
                <img src={avatarIcon} alt="admin" />
                Admin
              </div>
              <div className="prof-btn-overlay" ref={overlayRef}>
                <div className="prof-btn-link" onClick={handleLogout}>
                  <FaPowerOff />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="admin-dash-container">
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
                    <div className="p-degree p-field">
                      <span>Degree:</span> {alu.degree}
                    </div>
                    <div className="p-email p-field">
                      <span>Email:</span> {alu.email}
                    </div>
                    <div className="p-yearGrad p-field">
                      <span>Year of Graduation:</span> {alu.yearGraduation}
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
    </div>
  );
};

export default AdminDashboard;
