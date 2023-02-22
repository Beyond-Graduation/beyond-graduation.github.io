import React, { useRef, useState } from "react";
import "./Register.css";
import "../Login/Login.css";
import { HiOutlineMail } from "react-icons/hi";
import { BsFillPersonFill } from "react-icons/bs";
import { BiLockAlt } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../../auth/Auth";
import { FaHome } from "react-icons/fa";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const passToggleRef = useRef();
  const confPassToggleRef = useRef();
  const [userType, setUserType] = useState("student");

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword
    )
      toast.warning("Please fill all fields");
    else if (
      !credentials.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      toast.warning("Invalid email");
    else if (credentials.password.length < 6)
      toast.warning("Password too short");
    else if (credentials.password !== credentials.confirmPassword)
      toast.warning("Passwords do not match");
    else {
      isAuth.userType = userType;
      isAuth.registering = true;
      var name = credentials.name;
      var firstName = name.substring(0, name.indexOf(" "));
      var lastName = name.substring(name.indexOf(" ") + 1);
      navigate("/intro", {
        state: {
          creds: credentials,
          firstName: firstName,
          lastName: lastName,
          userType: isAuth.userType,
        },
      });
    }
  };

  const togglePassword = (param) => {
    const password =
      param === "pass" ? passToggleRef.current : confPassToggleRef.current;
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  return (
    <div className="register-main d-flex align-items-center justify-content-center">
      <Link to="/">
        <FaHome className="home-btn" />
      </Link>

      <div className="register-container">
        <h2 className="login-heading">Register</h2>
        <div className="register-tab d-flex align-items-center justify-content-center">
          <div
            className={`${
              userType === "student" ? "active-tab" : ""
            } reg-tab-head`}
          >
            <span onClick={() => setUserType("student")}>Student</span>
          </div>
          <div
            className={`${
              userType === "alumni" ? "active-tab" : ""
            } reg-tab-head`}
          >
            <span onClick={() => setUserType("alumni")}>Alumni</span>
          </div>
        </div>
        <div className="register-form">
          <div className="register-inputs">
            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Name"
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleRegister();
              }}
            />
            <BsFillPersonFill className="icon-email-name-pswd" />
          </div>

          <div className="register-inputs">
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Email"
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleRegister();
              }}
            />
            <HiOutlineMail className="icon-email-name-pswd" />
          </div>

          <div className="register-inputs">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              ref={passToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleRegister();
              }}
            />
            <BiLockAlt className="icon-email-name-pswd" />
            <AiFillEye
              className="icon-eye"
              id="pass"
              onClick={() => togglePassword("pass")}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleRegister();
              }}
            />
          </div>

          <div className="register-inputs">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              ref={confPassToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleRegister();
              }}
            />
            <BiLockAlt className="icon-email-name-pswd" />
            <AiFillEye
              className="icon-eye"
              id="confpass"
              onClick={() => togglePassword("confpass")}
            />
          </div>

          <div className="login-button" onClick={handleRegister}>
            REGISTER
          </div>
          <p className="bottom-line">
            Have an account already ?<Link to="/login"> Login Now.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
