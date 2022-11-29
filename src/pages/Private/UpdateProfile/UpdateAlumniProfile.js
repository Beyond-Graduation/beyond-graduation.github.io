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

function UpdateAlumniProfile({ data }) {
  const navigate = useNavigate();
  const [updateEnabled, setUpdateEnabled] = useState(true);

  const [{ userData, userId }, dispatch] = useStateValue();

  const [resumeFileName, setResumeFileName] = useState("");
  const [profilePic, setProfilePic] = useState(avatarIcon);
  const [defaultInterest, setDefaultInterest] = useState([]);
  const [internshipCount, setInternshipCount] = useState(0);
  const [internship, setInternship] = useState([]);
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

  const handleIntershipChange = (e, index) => {
    const newIntership = [...internship];
    if (e.target.name === "to" || e.target.name === "from") {
      newIntership[index][e.target.name] = Number(e.target.value);
    } else {
      newIntership[index][e.target.name] = e.target.value;
    }
    setInternship(newIntership);
    setFormDetails({ ...formDetails, internships: newIntership });
  };

  const addNewInternship = () => {
    setInternshipCount(internshipCount + 1);
    setInternship([
      ...internship,
      {
        company: "",
        role: "",
        from: 0,
        to: 0,
        contribution: "",
      },
    ]);
  };

  const removeInternship = (index) => {
    const newIntership = [...internship];
    newIntership.splice(index, 1);
    setInternship(newIntership);
    setInternshipCount(internshipCount - 1);
    setFormDetails({ ...formDetails, internships: newIntership });
  };

  const handleProjectsChange = (e, index) => {
    const newProject = [...projects];
    if (e.target.name === "to" || e.target.name === "from") {
      newProject[index][e.target.name] = Number(e.target.value);
    } else {
      newProject[index][e.target.name] = e.target.value;
    }
    setProjects(newProject);
    setFormDetails({ ...formDetails, projects: newProject });
  };

  const addNewProject = () => {
    setProjectCount(projectCount + 1);
    setProjects([
      ...projects,
      {
        from: "",
        to: "",
        title: "",
        domain: "",
        role: "",
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
    setFormDetails({ ...formDetails, projects: newProject });
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
    const token = localStorage.getItem("authKey");

    setFormDetails({ ...formDetails, profilePicPath: url });
    await axios({
      method: "post",
      url: "student/update",
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
    const token = localStorage.getItem("authKey");

    setFormDetails({ ...formDetails, resume: url });
    await axios({
      method: "post",
      url: "student/update",
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
      const token = localStorage.getItem("authKey");

      await axios({
        method: "post",
        url: "student/update",
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
    if (data.internships) {
      setInternship(data.internships);
      setInternshipCount(data.internships.length);
    }
    if (data.projects) {
      setProjects(data.projects);
      setProjectCount(data.projects.length);
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
                <div className="d-flex w-50">
                  <AnimatedInputField
                    name="email"
                    title="Email"
                    disabled
                    defaultValue={data.email}
                  />
                  {/* <AnimatedInputField
                    name="phoneNumber"
                    title="Phone Number"
                    // onChange={handleChange}
                  /> */}
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
                  defaultValue={
                    data.higherSecondary ? data.higherSecondary.board : null
                  }
                  onChange={handleSecondary}
                />
                <AnimatedInputField
                  name="cgpa"
                  title="Percentage"
                  defaultValue={
                    data.higherSecondary ? data.higherSecondary.cgpa : null
                  }
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
                  name="cgpa"
                  title="CGPA"
                  defaultValue={data.cgpa}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex">
                <AnimatedInputField
                  name="yearOfJoining"
                  title="Year of Joining"
                  defaultValue={data.yearOfJoining}
                  disabled
                  // onChange={handleChange}
                />
                <AnimatedInputField
                  name="expectedGraduationYear"
                  title="Year of Graduation"
                  defaultValue={data.expectedGraduationYear}
                  disabled
                  // onChange={handleChange}
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
              defaultValue={defaultInterest}
              onChange={(e) => handleInterstChange(e)}
            />
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head d-flex">
            Internship Experience
            <div
              className="add-experience-button d-flex ms-3"
              onClick={addNewInternship}
            >
              <div className="me-3">+</div>
              [Add another Internship]
            </div>
          </div>
          {[...Array(internshipCount)].map((x, i) => (
            <>
              <div className="m-4 mb-5">
                <div className="intro-form-inner">
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`company${i}`}
                      name="company"
                      title="Company/Organisation"
                      defaultValue={internship[i].company}
                      onChange={(e) => handleIntershipChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`startDate${i}`}
                      name="from"
                      title="From (year)"
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      defaultValue={internship[i].from}
                      onChange={(e) => handleIntershipChange(e, i)}
                    />
                  </div>
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`role${i}`}
                      name="role"
                      title="Role/Job Title"
                      defaultValue={internship[i].role}
                      onChange={(e) => handleIntershipChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`endDate${i}`}
                      type="number"
                      min="1900"
                      max="2099"
                      step="1"
                      name="to"
                      title="To (year)"
                      defaultValue={internship[i].to}
                      onChange={(e) => handleIntershipChange(e, i)}
                    />
                  </div>
                  <div className="d-flex align-items-end">
                    <AnimatedInputField
                      id={`contribution${i}`}
                      as="textarea"
                      name="contribution"
                      title="Internship Description"
                      rows={4}
                      className="mt-5"
                      defaultValue={internship[i].contribution}
                      onChange={(e) => handleIntershipChange(e, i)}
                    />
                    {internshipCount >= 1 && (
                      <div
                        className="d-flex align-items-center delete-experience"
                        onClick={() => {
                          removeInternship(i);
                        }}
                      >
                        <FaTrash className="me-2" /> Delete this Internship
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
            Projects
            <div
              className="add-experience-button d-flex ms-3"
              onClick={addNewProject}
            >
              <div className="me-3">+</div>
              [Add another project]
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
                  <div className="d-flex">
                    <AnimatedInputField
                      id={`role${i}`}
                      name="role"
                      title="Role"
                      defaultValue={projects[i].role}
                      onChange={(e) => handleProjectsChange(e, i)}
                    />
                    <AnimatedInputField
                      id={`from${i}`}
                      name="from"
                      title="From (year)"
                      defaultValue={projects[i].from}
                      onChange={(e) => handleProjectsChange(e, i)}
                    />
                  </div>
                  <div className="d-flex align-items-start">
                    <AnimatedInputField
                      id={`contribution${i}`}
                      as="textarea"
                      name="description"
                      title="Project Description"
                      rows={4}
                      className="mt-5"
                      defaultValue={projects[i].description}
                      onChange={(e) => handleProjectsChange(e, i)}
                    />
                    <div className="d-flex flex-column w-50">
                      <AnimatedInputField
                        id={`endDate${i}`}
                        type="number"
                        min="1900"
                        max="2099"
                        step="1"
                        name="to"
                        title="To (year)"
                        className="mt-4 mb-5"
                        defaultValue={projects[i].to}
                        onChange={(e) => handleProjectsChange(e, i)}
                      />
                      {projectCount >= 1 && (
                        <div
                          className="d-flex mt-4 align-items-center delete-experience"
                          onClick={() => {
                            removeProject(i);
                          }}
                        >
                          <FaTrash className="me-2" /> Delete this Project
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
