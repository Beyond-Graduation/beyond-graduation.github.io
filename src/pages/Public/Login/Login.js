import React, { useEffect } from "react";
import "./Login.css";
import { HiOutlineMail } from "react-icons/hi";
import { BiLockAlt } from "react-icons/bi";
import { AiFillEye, AiOutlineClose } from "react-icons/ai";
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
  const forgotPasswordEmailRef = useRef();
  const overlayCntRef = useRef();
  const overlayRef = useRef();
  const [forgotOverlay, setForgotOverlay] = React.useState(true);

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
      url: "user/login",
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
            res.data.userType.toLowerCase(),
            rememberRef.current.checked
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

  const resetPassword = async () => {
    const email = forgotPasswordEmailRef.current.value;
    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      toast.error("Invalid Email");
    else {
      await axios({
        method: "post",
        url: "user/forgot_password",
        data: {
          email: email,
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            toast.success("Reset Password Link sent to registered mail")
          }
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        overlayCntRef.current &&
        !overlayCntRef.current.contains(e.target) &&
        overlayRef.current.contains(e.target)
      ) {
        forgotPasswordEmailRef.current.value = "";
        setForgotOverlay(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

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

          <p id="fp" onClick={() => setForgotOverlay(true)}>
            Forgot Password ?
          </p>
          <label className="rem-cb d-flex align-items-center">
            <input type="checkbox" ref={rememberRef} /> Remember Me ?
          </label>
          <div className="login-button" onClick={handleLogin}>
            LOGIN
          </div>
          <p className="bottom-line">
            Don't have an account already ?
            <Link to="/register"> Register Now.</Link>
          </p>
        </div>
      </div>
      <div className="forgot-overlay" ref={overlayRef} hidden={!forgotOverlay}>
        <div className="forgot-overlay-cnt" ref={overlayCntRef}>
          <AiOutlineClose
            className="overlay-close"
            onClick={() => {
              forgotPasswordEmailRef.current.value = "";
              setForgotOverlay(false);
            }}
          />
          <div className="forgot-overlay-head">Forgot Password</div>
          <div className="input-cnt">
            <input
              type="email"
              name="forgotPswdEmail"
              autoComplete="off"
              placeholder="Registered Email"
              ref={forgotPasswordEmailRef}
              onKeyPress={(e) => {
                if (e.key === "Enter") resetPassword();
              }}
            ></input>
            <HiOutlineMail className="icon-email-pswd" />
          </div>
          <div className="forgot-btn" onClick={resetPassword}>
            Reset Password
          </div>
          <p>Password reset link would be sent to your email.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
