import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../auth/Auth";
import "./Navbar.css";
import { useStateValue } from "../../reducer/StateProvider";
import avatarIcon from "../../assets/images/avatar.png";
import { FaHome, FaPowerOff } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const ref = useRef();
  const checkRef = useRef();
  const overlayRef = useRef();

  const [{ userData, userId }, dispatch] = useStateValue();

  const handleLogout = () => {
    isAuth.logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        (!ref.current.contains(event.target) ||
          overlayRef.current.contains(event.target))
      ) {
        checkRef.current.checked = false;
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="navbar-main">
      <div className="d-flex align-items-center navbar-links">
        <Link to="/">
          <div className="nav-link">Home</div>
        </Link>
        <Link to="/about">
          <div className="nav-link">About</div>
        </Link>
        {isAuth.checkAuth() ? (
          <label htmlFor="profile-btn" className="nav-link" ref={ref}>
            <div className="profile-btn">
              <input id="profile-btn" type="checkbox" ref={checkRef} />
              <div>
                <img src={avatarIcon} alt={userData.firstName} />
                {userData.firstName}
              </div>
              <div className="prof-btn-overlay" ref={overlayRef}>
                <Link to="/dashboard">
                  <div className="prof-btn-link">
                    <FaHome />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link to="/profile">
                  <div className="prof-btn-link">
                    <BsPersonCircle />
                    <span>Profile</span>
                  </div>
                </Link>
                <div className="prof-btn-link" onClick={handleLogout}>
                  <FaPowerOff />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </label>
        ) : (
          <>
            <Link to="/login">
              <div className="navbar-btn">Login</div>
            </Link>
            <Link to="/register">
              <div className="navbar-btn">Register</div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
