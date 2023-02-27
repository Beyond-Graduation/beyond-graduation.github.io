import React, { useState } from "react";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import { MutliDropdown } from "../../../components/CustomDropdown/CustomDropdown";
import avatarIcon from "../../../assets/images/avatar.png";
import "./UpdateProfile.css";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "../../../components/axios";
import FileInput from "../../../components/FileInput/FileInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../../../reducer/StateProvider";
import { deleteObject, ref } from "firebase/storage";
import storage from "../../../firebase";

function UpdateAlumniProfile({ data }) {
  const navigate = useNavigate();
  const [updateEnabled, setUpdateEnabled] = useState(true);

  const [{ userData, userId }, dispatch] = useStateValue();

  const [resumeFileName, setResumeFileName] = useState("");
  const [profilePic, setProfilePic] = useState(avatarIcon);
  const [defaultInterest, setDefaultInterest] = useState([]);
  const [experienceCount, setExperienceCount] = useState(0);
  const [experience, setExperience] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [formDetails, setFormDetails] = useState(data);

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

  const handleExperienceChange = (e, index) => {
    const newExperience = [...experience];
    if (e.target.name === "to" || e.target.name === "from") {
      newExperience[index][e.target.name] = Number(e.target.value);
    } else {
      newExperience[index][e.target.name] = e.target.value;
    }
    setExperience(newExperience);
    setFormDetails({ ...formDetails, workExperience: newExperience });
  };

  const addNewExperience = () => {
    setExperienceCount(experienceCount + 1);
    setExperience([
      ...experience,
      {
        company: "",
        role: "",
        from: "",
        to: "",
        // Contribution: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
    setExperienceCount(experienceCount - 1);
    setFormDetails({ ...formDetails, workExperience: newExperience });
  };

  const handleProjectsChange = (e, index) => {
    const newProject = [...projects];
    newProject[index][e.target.name] = e.target.value;
    setProjects(newProject);
    setFormDetails({ ...formDetails, publications: newProject });
  };

  const addNewProject = () => {
    setProjectCount(projectCount + 1);
    setProjects([
      ...projects,
      {
        title: "",
        domain: "",
        link: "",
        description: "",
      },
    ]);
  };

  const removeProject = (index) => {
    const newProject = [...projects];
    newProject.splice(index, 1);
    setProjects(newProject);
    setProjectCount(projectCount - 1);
    setFormDetails({ ...formDetails, publications: newProject });
  };

  const InterestOptions = [
    { value: "Web Development", label: "Web Development" },
    { value: "App Development", label: "App Development" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Data Science", label: "Data Science" },
    { value: "Block Chain", label: "Block Chain" },
  ];

  const handleInterstChange = (e) => {
    const areas = [];
    e.forEach((item) => {
      areas.push(item.label);
    });
    setFormDetails({ ...formDetails, areasOfInterest: areas });
  };

  const defaultInterestList = () => {
    if (defaultInterest.length === 0) {
      const interests = defaultInterest;
      data.areasOfInterest.map((x) => interests.push({ value: x, label: x }));
      setDefaultInterest(interests);
    }
  };

  const handleProfilePicChange = async (url) => {
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");

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
    await axios({
      method: "post",
      url: "alumni/update",
      data: { profilePicPath: url },
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success("Profile Picture Updated !!");
        dispatch({
          type: "SET_USER_DATA",
          item: res.data,
        });
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
      });
  };

  const handleResumeChange = async (url) => {
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");

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
    await axios({
      method: "post",
      url: "alumni/update",
      data: { resume: url },
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success("Resume Updated !!");
        dispatch({
          type: "SET_USER_DATA",
          item: res.data,
        });
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
      });
  };

  const onUpdate = async () => {
    if (updateEnabled) {
      setUpdateEnabled(false);
      const token =
        localStorage.getItem("authKey") || sessionStorage.getItem("authKey");

      await axios({
        method: "post",
        url: "alumni/update",
        data: formDetails,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          toast.success("Updation Successful !!");
          dispatch({
            type: "SET_USER_DATA",
            item: res.data,
          });
          setUpdateEnabled(true);
          navigate("/profile");
        })
        .catch((e) => {
          toast.error("Something went wrong !!");
        });
    }
  };

  useEffect(() => {
    if (data.workExperience) {
      setExperience(data.workExperience);
      setExperienceCount(data.workExperience.length);
    }
    if (data.publications) {
      setProjects(data.publications);
      setProjectCount(data.publications.length);
    }
    if (data.profilePicPath) {
      setProfilePic(data.profilePicPath);
    }

    if (data.areasOfInterest) {
      defaultInterestList();
    }
    setFormDetails(data);
  }, [data]);

  useEffect(() => {
    console.log(formDetails);
  }, [formDetails]);

  return (
    <div className="intro-main">
      <div className="intro-container">
        <h1 className="intro-heading">Update Profile</h1>
        <div className="d-flex">
          <div>
            <section className="intro-section mt-5">
              <div className="head">Personal Information</div>
              <div className="intro-form-inner">
                <div className="d-flex">
                  <AnimatedInputField
                    name="firstName"
                    title="First Name"
                    defaultValue={data.firstName}
                    disabled
                  />
                  <AnimatedInputField
                    name="lastName"
                    title="Last Name"
                    defaultValue={data.lastName}
                    disabled
                  />
                </div>
                <div className="d-flex">
                  <AnimatedInputField
                    name="email"
                    title="Email"
                    disabled
                    defaultValue={data.email}
                  />
                  <AnimatedInputField
                    name="phone"
                    title="Phone Number"
                    defaultValue={data.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex">
                  <AnimatedInputField
                    as="textarea"
                    name="address"
                    title="Address"
                    rows={4}
                    className="mt-5"
                    defaultValue={data.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="intro-avatar d-flex flex-column align-items-center">
            <img src={profilePic} className="mb-4" alt="" />
            <FileInput
              label={
                data.profilePicPath
                  ? "Update Profile Picture"
                  : "Select Profile Picture"
              }
              content="alumni-profileImg"
              type="image"
              onUpload={handleProfilePicChange}
              onChange={(e) => {
                if (e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
                  setProfilePic(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
        </div>
        <section className="intro-section mt-5">
          <div className="head">Educational Qualification</div>

          <div className="m-4 mt-3">
            <div className="sub-head">Program Graduated from CET</div>
            <div className="intro-form-inner">
              <div className="d-flex">
                <AnimatedInputField
                  name="degree"
                  title="Degree"
                  defaultValue={data.degree}
                  disabled
                  // onChange={handleChange}
                />
                <AnimatedInputField
                  name="Department"
                  title="Department"
                  defaultValue={data.department}
                  disabled
                  // onChange={handleChange}
                />
                <AnimatedInputField
                  name="expectedGraduationYear"
                  title="Year of Graduation"
                  defaultValue={data.yearGraduation}
                  disabled
                  // onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="intro-section mt-5">
          <div className="head">Domain</div>
          <div className="m-4 mt-3">
            <MutliDropdown
              title="Areas of Interest"
              options={InterestOptions}
              defaultValue={defaultInterest}
              onChange={(e) => handleInterstChange(e)}
            />
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head d-flex">
            Work Experience
            <div
              className="add-experience-button d-flex ms-3"
              onClick={addNewExperience}
            >
              <div className="me-3">+</div>
              [Add another Work Experience]
            </div>
          </div>
          {[...Array(experienceCount)].map((x, i) => (
            <>
              <div className="m-4 mb-5">
                <div className="intro-form-inner">
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`company${i}`}
                      name="company"
                      title="Company/Organisation"
                      defaultValue={experience[i].company}
                      onChange={(e) => handleExperienceChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`startDate${i}`}
                      name="from"
                      title="From (year)"
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      defaultValue={experience[i].from}
                      onChange={(e) => handleExperienceChange(e, i)}
                    />
                  </div>
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`role${i}`}
                      name="role"
                      title="Role/Job Title"
                      defaultValue={experience[i].role}
                      onChange={(e) => handleExperienceChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`endDate${i}`}
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      name="to"
                      title="To (year)"
                      defaultValue={experience[i].to}
                      onChange={(e) => handleExperienceChange(e, i)}
                    />
                  </div>
                  <div className="d-flex align-items-start mt-4">
                    {experienceCount >= 1 && (
                      <div
                        className="d-flex align-items-center delete-experience m-0"
                        onClick={() => {
                          removeExperience(i);
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
          <div className="head d-flex">
            Publications
            <div
              className="add-experience-button d-flex ms-3"
              onClick={addNewProject}
            >
              <div className="me-3">+</div>
              [Add another publication]
            </div>
          </div>
          {[...Array(projectCount)].map((x, i) => (
            <>
              <div className="m-4 mb-5">
                <div className="intro-form-inner">
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`title${i}`}
                      name="title"
                      title="Title"
                      defaultValue={projects[i].title}
                      onChange={(e) => handleProjectsChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`domain${i}`}
                      name="domain"
                      title="Domain"
                      defaultValue={projects[i].domain}
                      onChange={(e) => handleProjectsChange(e, i)}
                    />
                  </div>

                  <div className="d-flex align-items-start">
                    <AnimatedInputField
                      id={`contribution${i}`}
                      as="textarea"
                      name="description"
                      title="Description"
                      rows={4}
                      className="mt-5"
                      defaultValue={projects[i].description}
                      onChange={(e) => handleProjectsChange(e, i)}
                    />
                    <div className="d-flex flex-column w-50">
                      <AnimatedInputField
                        id={`link${i}`}
                        name="link"
                        title="Link"
                        className="mb-4"
                        defaultValue={projects[i].link}
                        onChange={(e) => handleProjectsChange(e, i)}
                      />
                      {projectCount >= 1 && (
                        <div
                          className="d-flex mt-5 align-items-center delete-experience"
                          onClick={() => {
                            removeProject(i);
                          }}
                        >
                          <FaTrash className="me-2" /> Delete this Publication
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-end mt-5 ms-4"></div>
                </div>
              </div>
            </>
          ))}
        </section>

        <section className="intro-section mt-5">
          <div className="head">Relevant Links</div>
          <div className="intro-form-inner">
            <div className="d-flex">
              <AnimatedInputField
                name="github"
                title="Github"
                onChange={handleChange}
                defaultValue={data.github}
              />
              <AnimatedInputField
                name="linkedin"
                title="LinkedIn"
                onChange={handleChange}
                defaultValue={data.linkedin}
              />
            </div>
            <div className="other-links mt-4">
              <AnimatedInputField
                as="textarea"
                name="otherLinks"
                title="Others (if any)"
                rows={3}
                className="mt-5"
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Resume</div>
          <div className="m-4 mt-3 d-flex align-items-center">
            <FileInput
              label={data.resume ? "Update Resume" : "Upload Your Resume"}
              content="alumni-resume"
              type="file"
              onUpload={handleResumeChange}
              onChange={(e) => {
                setResumeFileName(e);
              }}
            />
            <span className="uploaded-file-name">{resumeFileName}</span>
          </div>
        </section>
        <div className="intro-reg-btn" onClick={onUpdate}>
          update
        </div>
      </div>
    </div>
  );
}

export default UpdateAlumniProfile;
