import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../auth/Auth";
import "./Navbar.css";
import { useStateValue } from "../../reducer/StateProvider";
import avatarIcon from "../../assets/images/avatar.png";
import { FaPowerOff } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { BsChatRightTextFill, BsPersonCircle } from "react-icons/bs";
import { useRef } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function NavbarMain() {
  const navigate = useNavigate();
  const ref = useRef();
  const checkRef = useRef();
  const overlayRef = useRef();
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

  useEffect(() => {
    setProfileImg(userData.profilePicPath);
  }, [userData]);

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/" className="logo">
          BeGrad
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto me-4">
            <Nav.Link href="/">Home</Nav.Link>
            {isAuth.isAuthenticated ? (
              <>
                <NavDropdown title="Profiles" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/alumni-profiles">
                    Alumni
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/student-profiles">
                    Student
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/blogs">Blogs</Nav.Link>
                <Nav.Link href="/notices">Notices</Nav.Link>
                <Nav.Link href="/internships/viewall">Internships</Nav.Link>
              </>
            ) : null}
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          {isAuth.isAuthenticated ? (
            <>
              <label htmlFor="profile-btn" className="nav-link" ref={ref}>
                <div className="profile-btn">
                  <input id="profile-btn" type="checkbox" ref={checkRef} />
                  <div className="flex-nowrap d-flex align-items-center profile-btn-main">
                    <img src={profileImg} alt={userData.firstName} />
                    <span>{userData.firstName}</span>
                  </div>
                  <div className="prof-btn-overlay" ref={overlayRef}>
                    <Link to="/profile">
                      <div className="prof-btn-link">
                        <BsPersonCircle />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <Link to="/chats">
                      <div className="prof-btn-link">
                        <BsChatRightTextFill />
                        <span>Chats</span>
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
              <Link to="/login" className="navbar-login">
                <div className="navbar-btn">Login</div>
              </Link>
              <Link to="/register" className="navbar-login">
                <div className="navbar-btn">Register</div>
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMain;
