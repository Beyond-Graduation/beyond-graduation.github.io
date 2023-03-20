import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../auth/Auth";
import "./Navbar.css";
import { useStateValue } from "../../reducer/StateProvider";
import avatarIcon from "../../assets/images/avatar.png";
import { FaPowerOff } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRef } from "react";

function Navbar() {
  const navigate = useNavigate();
  const ref = useRef();
  const checkRef = useRef();
  const overlayRef = useRef();
  const hamburgerRef = useRef();
  const mobileNavRef = useRef();
  const [profileImg, setProfileImg] = useState(avatarIcon);

  const [{ userData, userId }, dispatch] = useStateValue();

  const handleLogout = () => {
    isAuth.logout();
    dispatch({
      type: "REMOVE_USER_DATA",
      item: {},
    });
    navigate("/");
  };

  const hideNavbar = () => {
    hamburgerRef.current.classList.remove("toggle");
    mobileNavRef.current.classList.remove("show");
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

    const clickOutsideNav = (event) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        hamburgerRef.current.classList.remove("toggle");
        mobileNavRef.current.classList.remove("show");
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("click", clickOutsideNav, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("click", clickOutsideNav, true);
    };
  }, []);

  useEffect(() => {
    setProfileImg(userData.profilePicPath);
  }, [userData]);

  return (
    <div className="navbar-main d-flex">
      <Link to="/" className="nav-logo">
        BeGrad
      </Link>
      <div className="d-flex align-items-center navbar-links navbar-desktop">
        <Link to="/">
          <div className="nav-link">Home</div>
        </Link>
        {isAuth.checkAuth() ? (
          <>
            <div className="dropdown">
              Profiles
              <ul class="dropdown_menu dropdown_menu-2">
                <Link to="/alumni-profiles">
                  <li class="dropdown_item-1">Alumni</li>
                </Link>
                <Link to="/student-profiles">
                  <li class="dropdown_item-1">Student</li>
                </Link>
              </ul>
            </div>
            <Link to="/blogs">
              <div className="nav-link">Blogs</div>
            </Link>
            <Link to="/notices">
              <div className="nav-link">Notices</div>
            </Link>
          </>
        ) : null}
        <Link to="/about">
          <div className="nav-link">About</div>
        </Link>
        {isAuth.checkAuth() ? (
          <>
            <label htmlFor="profile-btn" className="nav-link" ref={ref}>
              <div className="profile-btn">
                <input id="profile-btn" type="checkbox" ref={checkRef} />
                <div>
                  <img src={profileImg} alt={userData.firstName} />
                  {userData.firstName}
                </div>
                <div className="prof-btn-overlay" ref={overlayRef}>
                  {/* <Link to="/dashboard">
                    <div className="prof-btn-link">
                      <FaHome />
                      <span>Dashboard</span>
                    </div>
                  </Link> */}
                  <Link to="/profile">
                    <div className="prof-btn-link">
                      <BsPersonCircle />
                      <span>My Profile</span>
                    </div>
                  </Link>
                  <Link to="/change_password">
                    <div className="prof-btn-link">
                      <AiFillLock />
                      <span>Change Password</span>
                    </div>
                  </Link>
                  <div className="prof-btn-link" onClick={handleLogout}>
                    <FaPowerOff />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </label>
          </>
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
      <div className="navbar-mobile">
        <div
          className="hamburger"
          ref={hamburgerRef}
          onClick={() => {
            hamburgerRef.current.classList.toggle("toggle");
            mobileNavRef.current.classList.toggle("show");
          }}
        >
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul className="mobile-nav-links" ref={mobileNavRef}>
          <li>
            <Link to="" onClick={hideNavbar}>
              Home
            </Link>
          </li>
          {isAuth.checkAuth() ? (
            <>
              <li>
                <Link to="/alumni-profiles" onClick={hideNavbar}>
                  Alumni Profiles
                </Link>
              </li>
              <li>
                <Link to="/student-profiles" onClick={hideNavbar}>
                  Student Profiles
                </Link>
              </li>
              <li>
                <Link to="/blogs" onClick={hideNavbar}>
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/notices" onClick={hideNavbar}>
                  Notices
                </Link>
              </li>
            </>
          ) : null}
          <li>
            <Link to="/about" onClick={hideNavbar}>
              About
            </Link>
          </li>
          {isAuth.checkAuth() ? (
            <li className="text-nowrap" onClick={handleLogout}>
              <FaPowerOff />
              <span className="ps-2">Logout</span>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={hideNavbar}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={hideNavbar}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
