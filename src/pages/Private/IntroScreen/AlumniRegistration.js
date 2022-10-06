import React, { useEffect, useState } from "react";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import avatarIcon from "../../../assets/images/avatar.png";
import { CustomDropdown, MutliDropdown } from "../../../components/CustomDropdown/CustomDropdown";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../../../components/axios";
import { toast } from "react-toastify";
import { isAuth } from "../../../auth/Auth";

function AluminiRegistration({ state }) {
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(avatarIcon);
  const [workCount, setWorkCount] = useState(1);
  const [workExp, setWorkExp] = useState([
    {
      company: "",
      role: "",
      from: 0,
      to: 0,
    },
  ]);

  const [formDetails, setFormDetails] = useState({
    userId: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    areasOfInterest: [],
    department: "",
    yearGraduation: "",
    degree: "",
    workExperience: [],
  });

  const InterestOptions = [
    { value: "Web Development", label: "Web Development" },
    { value: "App Development", label: "App Development" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Data Science", label: "Data Science" },
    { value: "Block Chain", label: "Block Chain" },
  ];

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const handleWorkExpChange = (e, index) => {
    const newWorkExp = [...workExp];
    if (e.target.name === "to" || e.target.name === "from") {
      newWorkExp[index][e.target.name] = Number(e.target.value);
    } else {
      newWorkExp[index][e.target.name] = e.target.value;
    }
    setWorkExp(newWorkExp);
    setFormDetails({ ...formDetails, workExperience: newWorkExp });
  };

  const handleInterstChange = (e) => {
    const areas = [];
    e.forEach((item) => {
      areas.push(item.label);
    });
    setFormDetails({ ...formDetails, areasOfInterest: areas });
  };

  const handleDepartmentChange = (e) => {
    if (e === null) {
      setFormDetails({ ...formDetails, department: "" });
    } else {
      setFormDetails({ ...formDetails, department: e.value });
    }
  };

  const departmentOptions = [
    {
      value: "Computer Science and Engineering",
      label: "Computer Science Engineering",
    },
    {
      value: "Electronics and Communication Engineering",
      label: "Electronics and Communication Engineering",
    },
    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
    { value: "Industrial Engineering", label: "Industrial Engineering" },
    {
      value: "Applied Electronics Engineering",
      label: "Applied Electronics Engineering",
    },
    {
      value: "Electrical and Electronics Engineering",
      label: "Electrical and Electronics Engineering",
    },
    { value: "Civil Engineering", label: "Civil Engineering" },
    { value: "Architecture (B. Arch.)", label: "Architecture (B. Arch.)" },
  ];

  const addNewExp = () => {
    setWorkCount(workCount + 1);
    setWorkExp([
      ...workExp,
      {
        company: "",
        role: "",
        from: 0,
        to: 0,
      },
    ]);
  };

  const removeExp = (index) => {
    const newWorkExp = [...workExp];
    newWorkExp.splice(index, 1);
    setWorkExp(newWorkExp);
    setWorkCount(workCount - 1);
  };

  const onRegister = async () => {
    if (
      formDetails.firstName === "" ||
      formDetails.lastName === "" ||
      formDetails.email === "" ||
      formDetails.password === "" ||
      formDetails.areasOfInterest.length === 0 ||
      formDetails.workExperience.length === 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    await axios({
      method: "post",
      url: "alumni/signup",
      data: formDetails,
    })
      .then((res) => {
        isAuth.registering = false;
        toast.success("Registration Successful !!");
        navigate("/login");
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
      });
  };

  useEffect(() => {}, [workCount, formDetails]);

  useEffect(() => {
    const generateUserId = () => {
      let userId = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 5; i++) {
        userId += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return userId;
    };

    setFormDetails({
      ...formDetails,
      email: state.creds.email,
      password: state.creds.password,
      userId: generateUserId(),
    });
  }, []);

  return (
    <div className="intro-main">
      <div className="intro-container">
        <h1 className="intro-heading">Alumni Registration Form</h1>
        <div className="d-flex">
          <div>
            <h4>Tell us more about you !</h4>
            <section className="intro-section mt-4">
              <div className="head">Personal Information</div>
              <div className="intro-form-inner">
                <div className="d-flex">
                  <AnimatedInputField
                    name="firstName"
                    title="First Name"
                    onChange={handleChange}
                  />
                  <AnimatedInputField
                    name="lastName"
                    title="Last Name"
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex w-50">
                  <AnimatedInputField
                    name="email"
                    title="Email"
                    disabled
                    defaultValue={state.creds.email}
                  />
                  {/* <AnimatedInputField
                    name="phoneNumber"
                    title="Phone Number"
                    onChange={handleChange}
                  /> */}
                </div>
              </div>
            </section>
          </div>
          <div className="intro-avatar d-flex flex-column align-items-center">
            <img src={profilePic} alt="" />
            <div class="image-input">
              <input
                type="file"
                name="image-input"
                id="image-input"
                class="image-input__input"
                onChange={(e) => {
                  if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
                    alert("not an image");
                  else setProfilePic(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <label class="image-input__label" for="image-input">
                <span>Upload a profile picture</span>
              </label>
            </div>
          </div>
        </div>
        <section className="intro-section mt-5">
          <div className="head">Educational Qualification</div>
          <div className="m-4 mt-3">
            <div className="sub-head">Undergraduate Degree</div>
            <div className="intro-form-inner">
              <div className="d-flex">
                <AnimatedInputField
                  name="degree"
                  title="Degree"
                  onChange={handleChange}
                />
                <CustomDropdown
                  title="Department"
                  options={departmentOptions}
                  onChange={(e) => handleDepartmentChange(e)}
                />
                <AnimatedInputField
                  name="yearGraduation"
                  title="Year of Graduation"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="intro-section mt-5">
          <div className="head d-flex">
            Work Experience
            <div
              className="add-experience-button d-flex ms-3"
              onClick={addNewExp}
            >
              <div className="me-3">+</div>
              [Add another experience]
            </div>
          </div>
          {[...Array(workCount)].map((x, i) => (
            <>
              <div className="m-4 my-5">
                <div className="intro-form-inner">
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`company${i}`}
                      name="company"
                      title="Company/Organisation"
                      value={workExp[i].company}
                      onChange={(e) => handleWorkExpChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`startDate${i}`}
                      name="from"
                      title="From (year)"
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      onChange={(e) => handleWorkExpChange(e, i)}
                    />
                  </div>
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`role${i}`}
                      name="role"
                      title="Role/Job Title"
                      onChange={(e) => handleWorkExpChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`endDate${i}`}
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      name="to"
                      title="To (year)"
                      onChange={(e) => handleWorkExpChange(e, i)}
                    />
                  </div>
                  <div className="d-flex align-items-end mt-5 ms-4">
                    {/* <AnimatedInputField
                      id={`description${i}`}
                      as="textarea"
                      name="description"
                      title="Job Description"
                      rows={4}
                      className="mt-5"
                      onChange={(e) => handleWorkExpChange(e, i)}
                    /> */}
                    {workCount > 1 && (
                      <div
                        className="d-flex align-items-center delete-experience"
                        onClick={() => {
                          removeExp(i);
                        }}
                      >
                        <FaTrash className="me-2" /> Delete this Experience
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </section>
        <section className="intro-section mt-5">
          <div className="head">Domain</div>
          <div className="m-4 mt-3">
            <MutliDropdown
              title="Domain"
              options={InterestOptions}
              onChange={(e) => handleInterstChange(e)}
            />
          </div>
        </section>

        <div className="intro-reg-btn" onClick={onRegister}>
          register
        </div>
      </div>
    </div>
  );
}

export default AluminiRegistration;
