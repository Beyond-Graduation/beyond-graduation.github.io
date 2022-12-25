import React from "react";
import { useEffect } from "react";
import { FaUserGraduate, FaBloggerB } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsBookFill } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import { RiNotification3Fill } from "react-icons/ri";
import axios from "../../axios";
import "./AdminHome.css";
import { useState } from "react";

function AdminHome({ data }) {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("authKey");
  const getData = async () => {
    await axios({
      method: "get",
      url: "admin/stats",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setStats(res.data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="admin-home">
      <div className="admin-det">
        <div className="admin-home-head">Personal Details</div>

        <div className="admin-person-info ms-5">
          <div className="d-flex">
            <div className="admin-det">
              <div className="admin-det-head">First Name</div>
              <div className="admin-det-body">{data.firstName}</div>
            </div>
            <div className="admin-det">
              <div className="admin-det-head">Last Name</div>
              <div className="admin-det-body">{data.lastName}</div>
            </div>
            <div className="admin-det">
              <div className="admin-det-head">Staff ID</div>
              <div className="admin-det-body">{data.staffId}</div>
            </div>
            <div className="admin-det">
              <div className="admin-det-head">Department</div>
              <div className="admin-det-body">{data.department}</div>
            </div>
          </div>
          <div className="d-flex">
            <div className="admin-det">
              <div className="admin-det-head">Email</div>
              <div className="admin-det-body">{data.email}</div>
            </div>
            <div className="admin-det">
              <div className="admin-det-head">Designation</div>
              <div className="admin-det-body">{data.designation}</div>
            </div>
            <div className="admin-det">
              <div className="admin-det-head">Phone Number</div>
              <div className="admin-det-body">{data.phone}</div>
            </div>
          </div>
        </div>

        <div className="plat-stats d-flex">
          <div className="stats-card">
            <div className="stats-card-inner">
              <FaUserGraduate />
              <div className="stat-name">
                Alumni <br />
                Count
              </div>
              <div className="stat-count">
                {stats.Alumni ? stats.Alumni : "0"}
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-inner">
              <CgProfile />
              <div className="stat-name">
                Student <br />
                Count
              </div>
              <div className="stat-count">
                {stats.Student ? stats.Student : "0"}
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-inner">
              <BsBookFill />
              <div className="stat-name">
                Faculty <br />
                Count
              </div>
              <div className="stat-count">
                {stats.Faculty ? stats.Faculty : "0"}
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-inner">
              <MdPendingActions />
              <div className="stat-name">
                Pending Alumni <br />
                Verifications
              </div>
              <div className="stat-count">
                {stats.AlumniPending ? stats.AlumniPending : "0"}
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-inner">
              <RiNotification3Fill />
              <div className="stat-name">
                Pending Notice <br />
                Verifications
              </div>
              <div className="stat-count">
                {stats.NoticePending ? stats.NoticePending : "0"}
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-card-inner">
              <FaBloggerB />
              <div className="stat-name">
                Blog <br />
                Count
              </div>
              <div className="stat-count">{stats.Blog ? stats.Blog : "0"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
