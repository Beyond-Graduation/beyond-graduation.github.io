import React, { useEffect, useState } from "react";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import avatarIcon from "../../../assets/images/avatar.png";
import uploadIcon from "../../../assets/icons/upload-file.svg";
import {
  CustomDropdown,
  MutliDropdown,
} from "../../../components/CustomDropdown/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { isAuth } from "../../../auth/Auth";
import axios from "../../../components/axios";
import { toast } from "react-toastify";
import FileInput from "../../../components/FileInput/FileInput";
import { deleteObject, ref } from "firebase/storage";
import storage from "../../../firebase";

function StudentRegistration({ state }) {
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
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
    gender: "",
    profilePicPath: "",
    resume: "",
    admissionId: "",
    cgpa: 0,
    phone: 0,
  });

  const handleChange = (e) => {
    const n = e.target.name;
    if (
      n === "cgpa" ||
      n === "hcgpa" ||
      n === "yearOfJoining" ||
      n === "expectedGraduationYear"
    )
      setFormDetails({ ...formDetails, [n]: Number(e.target.value) });
    else setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const handleInterstChange = (e) => {
    const areas = [];
    e.forEach((item) => {
      areas.push(item.label);
    });
    setFormDetails({ ...formDetails, areasOfInterest: areas });
  };

  const handleSecondary = (e) => {
    const n = e.target.name === "hcgpa" ? "cgpa" : "board";
    setFormDetails({
      ...formDetails,
      higherSecondary: {
        ...formDetails.higherSecondary,
        [n]:
          e.target.name === "hcgpa" ? Number(e.target.value) : e.target.value,
      },
    });
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

  const degreeOptions = [
    { value: "B-Tech", label: "B-Tech" },
    { value: "M-Tech", label: "M-Tech" },
    { value: "B-Arch", label: "B-Arch" },
    { value: "M-Arch", label: "M-Arch" },
    { value: "PhD", label: "PhD" },
  ];

  const handleDegreeChange = (e) => {
    if (e === null) {
      setFormDetails({ ...formDetails, degree: "" });
    } else {
      setFormDetails({ ...formDetails, degree: e.value });
    }
  };

  const InterestOptions = [
    { value: "webevelopment", label: "Web Development" },
    { value: "appevelopment", label: "App Development" },
    { value: "machineLearning", label: "Machine Learning" },
    { value: "dataScience", label: "Data Science" },
    { value: "blockChain", label: "Block Chain" },
  ];

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
      console.log(formDetails);
      if (
        formDetails.admissionId === "" ||
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
        formDetails.degree === "" ||
        formDetails.gender === "" ||
        formDetails.cgpa === 0
      ) {
        toast.error("Please fill all the fields");
        setRegistering(false);
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
          setRegistering(false);
        });
    }
  };

  // const getFile = (e) => {
  //   setResumeFileName(e.target.files[0].name);
  //   const file = e.target.files[0];

  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     console.log(typeof reader.result);
  //   };
  //   reader.onerror = (error) => {
  //     console.log("Error: ", error);
  //   };

  //   setTimeout(() => {
  //     console.log("object");
  //     saveAs(reader.result, "sampele.png");
  //   }, 5000);
  // };

  useEffect(() => {
    const generateUserId = () => {
      let userId = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
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
                <div className="d-flex">
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
                  {/* <AnimatedInputField
                    name="phoneNumber"
                    title="Phone Number"
                    onChange={handleChange}
                  /> */}
                </div>
                <div className="d-flex">
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
              content="student-profileImg"
              type="image"
              onUpload={handleProfilePicChange}
              onChange={(e) => {
                if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
                  alert("not an image");
                else setProfilePic(URL.createObjectURL(e.target.files[0]));
              }}
            />
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
                  name="hcgpa"
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
          <div className="m-4 mt-3 d-flex align-items-center">
            <FileInput
              label="Upload Your Resume"
              type="file"
              content="student-resume"
              onUpload={handleResumeChange}
              onChange={(e) => {
                setResumeFileName(e);
              }}
            />
            <span className="uploaded-file-name">{resumeFileName}</span>
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
