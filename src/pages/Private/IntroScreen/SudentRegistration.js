import React, { useEffect, useState } from "react";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import avatarIcon from "../../../assets/images/avatar.png";
import uploadIcon from "../../../assets/icons/upload-file.svg";
import { MutliDropdown } from "../../../components/CustomDropdown/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../../../auth/Auth";
import axios from "../../../components/axios";
import { toast } from "react-toastify";

function StudentRegistration({ state }) {
  const navigate = useNavigate();
  const [resumeFileName, setResumeFileName] = useState("");
  const [profilePic, setProfilePic] = useState(avatarIcon);

  const [formDetails, setFormDetails] = useState({
    userId: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    areasOfInterest: [],
    higherSecondary: { board: "", cgpa: 0 },
    department: "",
    expectedGraduationYear: 0,
    yearOfJoining: 0,
    degree: "",
  });

  const handleChange = (e) => {
    const n = e.target.name;
    if (
      n === "cgpa" ||
      n === "yearOfJoining" ||
      n === "expectedGraduationYear"
    ) {
      setFormDetails({ ...formDetails, [n]: Number(e.target.value) });
    } else {
      setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
    }
  };

  const handleInterstChange = (e) => {
    const areas = [];
    e.forEach((item) => {
      areas.push(item.label);
    });
    setFormDetails({ ...formDetails, areasOfInterest: areas });
  };

  const handleSecondary = (e) => {
    setFormDetails({
      ...formDetails,
      higherSecondary: {
        ...formDetails.higherSecondary,
        [e.target.name]:
          e.target.name === "cgpa" ? Number(e.target.value) : e.target.value,
      },
    });
  };

  const InterestOptions = [
    { value: "webevelopment", label: "Web Development" },
    { value: "appevelopment", label: "App Development" },
    { value: "machineLearning", label: "Machine Learning" },
    { value: "dataScience", label: "Data Science" },
    { value: "blockChain", label: "Block Chain" },
  ];

  const onRegister = async () => {
    if (
      formDetails.firstName === "" ||
      formDetails.lastName === "" ||
      formDetails.email === "" ||
      formDetails.password === "" ||
      formDetails.department === "" ||
      formDetails.yearOfJoining === 0 ||
      formDetails.expectedGraduationYear === 0 ||
      formDetails.areasOfInterest.length === 0 ||
      formDetails.higherSecondary.board === "" ||
      formDetails.higherSecondary.cgpa === 0 ||
      formDetails.degree === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    await axios({
      method: "post",
      url: "student/signup",
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

  useEffect(() => {}, [formDetails]);

  return (
    <div className="intro-main">
      <div className="intro-container">
        <h1 className="intro-heading">Student Registration Form</h1>
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
            <div className="sub-head">12th Grade</div>
            <div className="intro-form-inner">
              <div className="d-flex">
                <AnimatedInputField
                  name="board"
                  title="Board"
                  onChange={handleSecondary}
                />
                <AnimatedInputField
                  name="cgpa"
                  title="Percentage"
                  onChange={handleSecondary}
                />
              </div>
            </div>
          </div>
          <div className="m-4 mt-3">
            <div className="sub-head">Undergraduate Degree</div>
            <div className="intro-form-inner">
              <div className="d-flex">
                <AnimatedInputField
                  name="degree"
                  title="Degree"
                  onChange={handleChange}
                />
                <AnimatedInputField
                  name="department"
                  title="Department"
                  onChange={handleChange}
                />
                <AnimatedInputField
                  name="cgpa"
                  title="CGPA"
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex">
                <AnimatedInputField
                  name="yearOfJoining"
                  title="Year of Joining"
                  onChange={handleChange}
                />
                <AnimatedInputField
                  name="expectedGraduationYear"
                  title="Year of Graduation"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="intro-section mt-5">
          <div className="head">Areas of Interest</div>
          <div className="m-4 mt-3">
            <MutliDropdown
              title="Areas of Interest"
              options={InterestOptions}
              onChange={(e) => handleInterstChange(e)}
            />
          </div>
        </section>
        <section className="intro-section mt-5">
          <div className="head">Resume</div>
          <div className="m-4 mt-3">
            <div class="file-input">
              <input
                type="file"
                name="file-input"
                id="file-input"
                class="file-input__input"
                onChange={(e) => setResumeFileName(e.target.files[0].name)}
              />
              <label class="file-input__label" for="file-input">
                <span>Upload Your Resume</span>
                <img src={uploadIcon} alt="Upload Resume" />
              </label>
              <span className="uploaded-file-name">{resumeFileName}</span>
            </div>
          </div>
        </section>
        <div className="intro-reg-btn" onClick={onRegister}>
          register
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;
