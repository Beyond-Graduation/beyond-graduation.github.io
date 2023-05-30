import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import avatarIcon from "../../../../assets/images/avatar.png";
import AlumniVerification from "../../../../components/AdminDashboard/AlumniVerification/AlumniVerification";
import axios from "../../../../components/axios";
import { FaPowerOff } from "react-icons/fa";
import { isAuth } from "../../../../auth/Auth";
import { useNavigate, useParams } from "react-router-dom";
import AdminHome from "../../../../components/AdminDashboard/Home/AdminHome";
import { useStateValue } from "../../../../reducer/StateProvider";
import AdminNoticePublish from "../../../../components/AdminDashboard/NoticePublish/AdminNoticePublish";
import AdminNoticeView from "../../../../components/AdminDashboard/AdminNoticeView/AdminNoticeView";
import AdminNoticeVerification from "../../../../components/AdminDashboard/AdminNoticeVerification/AdminNoticeVerification";

const AdminDashboard = () => {
  const [{ userData, userId }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(0);
  const [profImg, setProfImg] = useState(avatarIcon);
  const [pending, setPending] = useState([]);
  const { func } = useParams();
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");

  const menuArray = [
    "home",
    "alumni-verification",
    "notice-verification",
    "publish-notice",
    "view-notice",
  ];

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
    dispatch({
      type: "REMOVE_USER_DATA",
      item: {},
    });
    navigate("/");
  };

  useEffect(() => {
    getData();
    if (func) setActiveMenu(menuArray.indexOf(func));
  }, []);

  useEffect(() => {
    setProfImg(userData.profilePicPath);
  }, [userData]);

  const menuOptions = [
    {
      name: "Home",
      component: <AdminHome data={userData} />,
    },
    {
      name: "Alumni Verification",
      component: <AlumniVerification pending={pending} getData={getData} />,
    },
    {
      name: "Notices Verification",
      component: <AdminNoticeVerification />,
    },
    {
      name: "Notice Publication",
      component: <AdminNoticePublish />,
    },
    {
      name: "Notices View",
      component: <AdminNoticeView />,
    },
  ];

  return (
    <div className="admin-dash d-flex">
      <div className="admin-dash-left">
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <div className="admin-profile-icon d-flex align-items-center ms-4">
              <img src={profImg} alt="" />
              <span>Admin</span>
            </div>
            <div className="admin-nav mt-5 ms-4">
              {menuOptions.map((opt, i) => (
                <div
                  className={`admin-nav-item ${
                    activeMenu === i ? "active" : ""
                  }`}
                  onClick={(e) => {
                    setActiveMenu(i);
                    navigate("/admin/" + menuArray[i]);
                  }}
                  key={i}
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
