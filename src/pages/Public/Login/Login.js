import React from "react";
import "./Login.css";
import { HiOutlineMail } from "react-icons/hi";
import { BiLockAlt } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../../../auth/Auth";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useStateValue } from "../../../reducer/StateProvider";
import axios from "../../../components/axios";

function Login() {
  const navigate = useNavigate();
  const passToggleRef = useRef();
  const rememberRef = useRef();

  const [{ userData, userId }, dispatch] = useStateValue();

  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    await axios({
      method: "post",
      url: "login",
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          // console.log(res.data);
          isAuth.login(
            res.data.token,
            res.data.userId,
            res.data.userType.toLowerCase()
          );
          isAuth.userType = res.data.userType.toLowerCase();
          dispatch({
            type: "SET_USER_ID",
            item: res.data.userId,
          });
          await axios({
            method: "get",
            url:
              res.data.userType.toLowerCase() === "student"
                ? `student/student_details?userId=${res.data.userId}`
                : res.data.userType.toLowerCase() === "alumni"
                ? `alumni/alumni_details?userId=${res.data.userId}`
                : `admin/admin_details?userId=${res.data.userId}`,
            headers: {
              Authorization: `bearer ${res.data.token}`,
            },
          }).then((res) => {
            if (res.status === 200) {
              dispatch({
                type: "SET_USER_DATA",
                item: res.data,
              });
            }
          });
          toast.success("Login Successfull !!");
          navigate("/dashboard");
        } else {
          toast.error("Something went wrong !!");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  const togglePassword = () => {
    const password = passToggleRef.current;
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  return (
    <div className="login-main d-flex align-items-center justify-content-center">
      <Link to="/">
        <FaHome className="home-btn" />
      </Link>
      <div className="login-container">
        <h2 className="login-heading">Login</h2>
        <div className="login-form">
          <div className="input-cnt">
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Email"
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            ></input>
            {/* placholder space = padding for input (remind me to explain this) */}
            <HiOutlineMail className="icon-email-pswd" />
          </div>
          <div className="input-cnt">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              ref={passToggleRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            ></input>
            <BiLockAlt className="icon-email-pswd" />
            <AiFillEye className="icon-eye" onClick={togglePassword} />
          </div>

          <p id="fp">Forgot Password ?</p>
          <label className="rem-cb d-flex align-items-center">
            <input type="checkbox" ref={rememberRef} /> Remember Me ?
          </label>
          <div className="login-button" onClick={handleLogin}>
            LOGIN
          </div>
          {/* <p id="bottom-line"> Don't have an account already? Register Now.</p>
                Use className so that we can reuse this class for register page
           */}
          <p className="bottom-line">
            Don't have an account already ?
            <Link to="/register"> Register Now.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
