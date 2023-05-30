import React, { useEffect, useState } from "react";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import avatarIcon from "../../../assets/images/avatar.png";
import {
  CustomDropdown,
  MutliDropdown,
} from "../../../components/CustomDropdown/CustomDropdown";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../../../components/axios";
import { toast } from "react-toastify";
import { isAuth } from "../../../auth/Auth";
import FileInput from "../../../components/FileInput/FileInput";
import { deleteObject, ref } from "firebase/storage";
import storage from "../../../firebase";
import { Spinner } from "react-bootstrap";

function AluminiRegistration({ state }) {
  const navigate = useNavigate();

  const [registering, setRegistering] = useState(false);
  const [profilePic, setProfilePic] = useState(avatarIcon);
  const [workCount, setWorkCount] = useState(1);
  const [resumeFileName, setResumeFileName] = useState("");
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
    gender: "",
    admissionId: "",
    phone: "",
    resume: "",
    profilePicPath: "",
  });

  const degreeOptions = [
    { value: "B-Tech", label: "B-Tech" },
    { value: "M-Tech", label: "M-Tech" },
    { value: "B-Arch", label: "B-Arch" },
    { value: "M-Arch", label: "M-Arch" },
    { value: "PhD", label: "PhD" },
  ];

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

  const handleDegreeChange = (e) => {
    if (e === null) {
      setFormDetails({ ...formDetails, degree: "" });
    } else {
      setFormDetails({ ...formDetails, degree: e.value });
    }
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Transgender", label: "Transgender" },
    { value: "Non-binary/non-conforming", label: "Non-binary/non-conforming" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  const handleGenderChange = (e) => {
    if (e === null) {
      setFormDetails({ ...formDetails, gender: "" });
    } else {
      setFormDetails({ ...formDetails, gender: e.value });
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
    { value: "Architecture", label: "Architecture" },
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

  const handleProfilePicChange = (url) => {
    if (formDetails.profilePicPath) {
      var storageRef = ref(storage, formDetails.profilePicPath);
      deleteObject(storageRef)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong !!!");
        });
    }

    setFormDetails({ ...formDetails, profilePicPath: url });
  };

  const handleResumeChange = (url) => {
    if (formDetails.resume) {
      var storageRef = ref(storage, formDetails.resume);
      deleteObject(storageRef)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong !!!");
        });
    }

    setFormDetails({ ...formDetails, resume: url });
  };

  const onRegister = async () => {
    if (!registering) {
      setRegistering(true);
      if (formDetails.workExperience.length !== 0) {
        if (
          formDetails.workExperience[0].company === "" &&
          formDetails.workExperience[0].role === ""
        ) {
          setFormDetails({ ...formDetails, workExperience: [] });
        }
      }

      if (
        formDetails.admissionId === "" ||
        formDetails.firstName === "" ||
        formDetails.lastName === "" ||
        formDetails.email === "" ||
        formDetails.password === "" ||
        formDetails.department === "" ||
        !formDetails.yearGraduation ||
        formDetails.areasOfInterest.length === 0 ||
        formDetails.degree === "" ||
        formDetails.gender === ""
      ) {
        toast.error("Please fill all the fields");
        setRegistering(false);
        return;
      }

      if (formDetails.profilePicPath === "") {
        setRegistering(false);
        toast.error("Add Profile Picture");
        return;
      }

      if (formDetails.resume === "") {
        setRegistering(false);
        toast.error("Upload your resume");
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
          setRegistering(false);
        });
    }
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
        <h4>Tell us more about you !</h4>
        <div className="d-flex flex-lg-row flex-column-reverse">
          <div>
            <section className="intro-section mt-4">
              <div className="head">Personal Information</div>
              <div className="intro-form-inner">
                <div className="d-md-flex">
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
                <div className="d-md-flex">
                  <AnimatedInputField
                    name="email"
                    title="Email"
                    disabled
                    defaultValue={state.creds.email}
                  />
                  <CustomDropdown
                    title="Gender"
                    options={genderOptions}
                    onChange={(e) => handleGenderChange(e)}
                  />
                </div>
                <div className="d-md-flex">
                  <AnimatedInputField
                    name="admissionId"
                    title="Admission Number (CET)"
                    onChange={handleChange}
                  />
                  <AnimatedInputField
                    name="phone"
                    title="Phone Number"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="intro-avatar d-flex flex-column align-items-center">
            <img src={profilePic} alt="" className="mb-4" />
            <FileInput
              label="Select Profile Picture"
              content="alumni-profileImg"
              type="image"
              onUpload={handleProfilePicChange}
              onChange={(e) => {
                setProfilePic(e);
              }}
            />
          </div>
        </div>
        <section className="intro-section mt-5">
          <div className="head">
            Program Graduated from College of Engineering Trivandrum
          </div>
          <div className="intro-form-inner">
            <div className="d-md-flex">
              <CustomDropdown
                title="Degree"
                options={degreeOptions}
                onChange={(e) => handleDegreeChange(e)}
              />
              <CustomDropdown
                title="Department"
                options={departmentOptions}
                onChange={(e) => handleDepartmentChange(e)}
              />
              <AnimatedInputField
                name="yearGraduation"
                title="Year of Graduation"
                type="number"
                min="1900"
                max="2099"
                step="1"
                onChange={handleChange}
              />
            </div>
          </div>
        </section>
        <section className="intro-section mt-5">
          <div className="head">Domain</div>
          <div className="m-4 mt-3">
            <MutliDropdown
              title="Domain (select from the menu or type)"
              options={InterestOptions}
              onChange={(e) => handleInterstChange(e)}
            />
          </div>
        </section>
        <section className="intro-section mt-5">
          <div className="head d-md-flex">
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
              <div className="m-md-4 my-md-5 m-2">
                <div className="intro-form-inner">
                  <div className="d-md-flex">
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
                  <div className="d-md-flex">
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
                        className="d-flex align-items-center justify-content-aroundnp delete-experience"
                        onClick={() => {
                          removeExp(i);
                        }}
                      >
                        <FaTrash className="me-2" />
                        <span>Delete this Experience</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </section>
        <section className="intro-section mt-md-5">
          <div className="head">Resume</div>
          <div className="m-4 mt-3 d-md-flex align-items-center">
            <FileInput
              label="Upload Your Resume"
              type="file"
              content="alumni-resume"
              onUpload={handleResumeChange}
              onChange={(e) => {
                setResumeFileName(e);
              }}
            />
            <span className="uploaded-file-name">{resumeFileName}</span>
          </div>
        </section>

        <div className="intro-reg-btn" onClick={onRegister}>
          {registering ? (
            <Spinner animation="border" size="sm"></Spinner>
          ) : (
            "register"
          )}
        </div>
      </div>
    </div>
  );
}

export default AluminiRegistration;
