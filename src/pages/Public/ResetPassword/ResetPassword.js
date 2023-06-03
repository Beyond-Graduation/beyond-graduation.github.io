import React, { useRef } from "react";
import "./ResetPassword.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BiLockAlt } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "../../../components/axios";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const passToggleRef = useRef();
  const confPassToggleRef = useRef();

  const [credentials, setCredentials] = React.useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
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

  const handleResetPassword = async () => {
    //console.log(credentials);
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      await axios({
        method: "post",
        url: "user/reset_password",
        data: {
          passwordResetToken: token,
          newPassword: credentials.password,
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            toast.success("Password reset successful");
            navigate("/login");
          } else {
            toast.error("Something went wrong !!");
          }
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    }
  };

  return (
    <div className="resetPass-main d-flex align-items-center justify-content-center">
      <Link to="/">
        <FaHome className="home-btn" />
      </Link>
      <div className="login-container">
        <h2 className="resetPass-heading">Reset Password</h2>
        <div className="login-form">
          <div className="input-cnt mt-2">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              ref={passToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleResetPassword();
              }}
            ></input>
            <BiLockAlt className="icon-email-pswd" />
            <AiFillEye
              className="icon-eye"
              onClick={() => togglePassword("pass")}
            />
          </div>
          <div className="input-cnt mt-2 mb-3">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              onChange={handleChange}
              ref={confPassToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleResetPassword();
              }}
            ></input>
            <BiLockAlt className="icon-email-pswd" />
            <AiFillEye
              className="icon-eye"
              onClick={() => togglePassword("confPass")}
            />
          </div>

          <div className="login-button" onClick={handleResetPassword}>
            RESET PASSWORD
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
