import React, { useState } from "react";
import "./ChangePassowrd.css";
import { BiLockAlt } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { useRef } from "react";
import { toast } from "react-toastify";
import axios from "../../../components/axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const oldPassToggleRef = useRef();
  const newPassToggleRef = useRef();
  const confPassToggleRef = useRef();

  const [credentials, setCredentials] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePassword = (param) => {
    const password =
      param === "pass"
        ? oldPassToggleRef.current
        : param === "newPass"
        ? newPassToggleRef.current
        : confPassToggleRef.current;
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  const handlePassChange = async () => {
    if (
      !credentials.oldPassword ||
      !credentials.newPassword ||
      !credentials.confirmNewPassword
    )
      toast.warning("Please fill all fields");
    else if (credentials.newPassword.length < 6)
      toast.warning(" New Password too short");
    else if (credentials.newPassword !== credentials.confirmNewPassword)
      toast.warning("Passwords do not match");
    else {
      const token =
        localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
      await axios({
        method: "post",
        url: "user/change_password",
        data: {
          oldPassword: credentials.oldPassword,
          newPassword: credentials.newPassword,
        },
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            toast.success("Password Reset Successfully !!");
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          //console.log(err);
          toast.error(err.response.data);
        });
    }
  };

  return (
    <div className="changePass">
      <div className="changePass-container">
        <div className="changePass-heading">Change Password</div>

        <div className="register-form">
          <div className="register-inputs mt-2">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              onChange={handleChange}
              ref={oldPassToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handlePassChange();
              }}
            />
            <BiLockAlt className="icon-email-name-pswd" />
            <AiFillEye
              className="icon-eye"
              id="pass"
              onClick={() => togglePassword("pass")}
            />
          </div>

          <div className="register-inputs mt-2">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
              ref={newPassToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handlePassChange();
              }}
            />
            <BiLockAlt className="icon-email-name-pswd" />
            <AiFillEye
              className="icon-eye"
              id="pass"
              onClick={() => togglePassword("newPass")}
            />
          </div>

          <div className="register-inputs mt-2">
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              onChange={handleChange}
              ref={confPassToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handlePassChange();
              }}
            />
            <BiLockAlt className="icon-email-name-pswd" />
            <AiFillEye
              className="icon-eye"
              id="pass"
              onClick={() => togglePassword("confNewPass")}
            />
          </div>

          <div className="login-button" onClick={handlePassChange}>
            CHANGE PASSWORD
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
