import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import avatarIcon from "../../../../assets/images/avatar.png";
import AlumniVerification from "../../../../components/AdminDashboard/AlumniVerification/AlumniVerification";
import axios from "../../../../components/axios";
import { FaPowerOff } from "react-icons/fa";
import { isAuth } from "../../../../auth/Auth";
import { useNavigate } from "react-router-dom";

const Sample = () => {
  return <></>;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(0);

  const [pending, setPending] = useState([]);
  const token = localStorage.getItem("authKey");
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
      }
    });
  };

  const handleLogout = () => {
    isAuth.logout();
    navigate("/");
  };

  useEffect(() => {
    getData();
  }, []);

  const menuOptions = [
    {
      name: "Home",
      component: <Sample />,
    },
    {
      name: "Alumni Verification",
      component: <AlumniVerification pending={pending} getData={getData} />,
    },
    {
      name: "Notices Verification",
      component: <Sample />,
    },
    {
      name: "Notice Publication",
      component: <Sample />,
    },
    {
      name: "Notices View",
      component: <Sample />,
    },
    {
      name: "Data Modification",
      component: <Sample />,
    },
  ];

  return (
    <div className="admin-dash d-flex">
      <div className="admin-dash-left">
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <div className="admin-profile-icon d-flex align-items-center ms-4">
              <img src={avatarIcon} alt="" />
              <span>Admin</span>
            </div>
            <div className="admin-nav mt-5 ms-4">
              {menuOptions.map((opt, i) => (
                <div
                  className={`admin-nav-item ${
                    activeMenu === i ? "active" : ""
                  }`}
                  onClick={(e) => setActiveMenu(i)}
                >
                  {opt.name}
                </div>
              ))}
            </div>
          </div>
          <div
            className="admin-logout mb-5 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <FaPowerOff /> Logout
          </div>
        </div>
      </div>
      <div className="admin-dash-right">
        {menuOptions[activeMenu].component}
      </div>
    </div>
  );
};

export default AdminDashboard;
