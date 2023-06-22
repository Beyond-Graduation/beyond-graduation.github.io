import React, { useState } from "react";
import "./InternshipPosting.css";
import AnimatedInputField from "../../../../components/AnimatedInputField/AnimatedInputField";
import { Editor } from "@tinymce/tinymce-react";
import { CustomDropdown } from "../../../../components/CustomDropdown/CustomDropdown";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useRef } from "react";
import axios from "../../../../components/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStateValue } from "../../../../reducer/StateProvider";

function InternshipPosting() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const editorRef = useRef();
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(0);
  const [question, setQuestion] = useState([
    { question: "Why should you be selected for this role ?" },
    {
      question:
        "Are you available for the time duration applicable to this role ?",
    },
    { question: "Past work experience. Share links (if any) ?" },
  ]);
  const [formDetails, setFormDetails] = useState({
    internshipId: "",
    email: "",
    role: "",
    companyName: "",
    description: template_value,
    stipend: "",
    duration: "",
    workingType: "",
    qnas: question,
  });

  const handleBlogContentChange = (e) => {
    setFormDetails({
      ...formDetails,
      description: editorRef.current.getContent(),
    });
  };

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let oppoId = "oppo";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      oppoId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log(oppoId);
    setFormDetails({
      ...formDetails,
      internshipId: oppoId,
      email: userData.email ? userData.email : "",
    });
  }, []);

  const addNewQuestion = () => {
    setQuestionCount(questionCount + 1);
    setQuestion([
      ...question,
      {
        question: "",
        // Contribution: "",
      },
    ]);
  };
  const removeQuestion = (index) => {
    const newQuestion = [...question];
    newQuestion.splice(index + 3, 1);
    setQuestion(newQuestion);
    setQuestionCount(questionCount - 1);
    setFormDetails({ ...formDetails, qnas: newQuestion });
  };

  const onQuestionChange = (e, index) => {
    const newQuestion = [...question];
    newQuestion[index + 3].question = e.target.value;
    setQuestion(newQuestion);
    setFormDetails({ ...formDetails, qnas: newQuestion });
  };

  const WorkTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
  ];

  const handleWorkTypeChange = (e) => {
    if (e === null) {
      setFormDetails({ ...formDetails, workingType: "" });
    } else {
      setFormDetails({ ...formDetails, workingType: e.value });
    }
  };

  // useEffect(() => {
  //   //console.log(question);
  // }, [question]);

  // useEffect(() => {
  //   console.log(formDetails);
  // }, [formDetails]);

  const onInternshipPost = async () => {
    let token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    await axios({
      method: "post",
      url: "internship/create",
      data: formDetails,
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success("Internship Posted successfully");
        navigate("/dashboard");
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
      });
  };

  return (
    <div className="main-intro">
      <div className="main-container">
        <h1 className="main-heading">Internship Specifications</h1>
        <div className="d-flex">
          <div>
            <section className="intro-section mt-5">
              <div className="head">Personal Information</div>
              <div className="intro-form-inner">
                <div className="d-flex">
                  <AnimatedInputField
                    name="email"
                    title="Email"
                    defaultValue={formDetails.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className="intro-section mt-5">
          <div className="head">Internship Details</div>
          <div className="intro-form-inner">
            <div className="d-flex">
              <AnimatedInputField
                name="role"
                title="Role"
                onChange={handleChange}
              />
              <AnimatedInputField
                name="companyName"
                title="Company Name"
                onChange={handleChange}
              />
              <AnimatedInputField
                name="stipend"
                title="Stipend"
                onChange={handleChange}
              />
            </div>

            <div className="d-flex">
              <AnimatedInputField
                name="duration"
                title="Duration"
                onChange={handleChange}
              />

              <div className="mb-1 w-25">
                <CustomDropdown
                  title="Full Time/ Part Time"
                  options={WorkTypeOptions}
                  //defaultValue={defaultInterest}
                  onChange={(e) => handleWorkTypeChange(e)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head mb-4">Description</div>
          <Editor
            initialValue={template_value}
            init={{
              height: 600,
            }}
            onInit={(evt, editor) => (editorRef.current = editor)}
            onSelectionChange={handleBlogContentChange}
          />
          {/* <div className="intro-form-inner">
            <div className="internship-field w-75 mt-4">
              <div className="sub-head">About the company</div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                //title="About the company"
                rows={3}
                cols={100}
                //className="mt-5"
                //onChange={handleChange}
              />
            </div>

            <div className="internship-field w-75 mt-4">
              <div className="sub-head">About the internship</div>
              <AnimatedInputField
                as="textarea"
                // name="About the internship"
                // title="About the internship"
                rows={3}
                //onChange={handleChange}
              />
            </div>

            <div className="internship-field w-75 mt-4">
              <div className="sub-head">Pre-requisite/Skills required</div>
              <AnimatedInputField
                as="textarea"
                // name="About the company"
                // title="About the company"
                rows={3}
                //onChange={handleChange}
              />
            </div>
          </div> */}
        </section>

        {/* <section className="intro-section mt-5">
          <div className="head">Perks</div>
          <div className="m-4 mt-3">
            <MutliDropdown
              title="Perks"
              options={PerkOptions}
              //defaultValue={defaultInterest}
              onChange={(e) => handlePerkChange(e)}
            />
          </div>
        </section> */}

        <section className="intro-section mt-5">
          <div className="head d-flex">
            Questions for the Applicant
            <div
              className="add-experience-button d-flex ms-3"
              onClick={addNewQuestion}
            >
              <div className="me-3">+</div>
              [Add another Question]
            </div>
          </div>
          {[...Array(questionCount)].map((x, i) => (
            <>
              <div className="m-4 mb-5">
                <div className="intro-form-inner">
                  <div className="d-flex internship-ques w-50">
                    <AnimatedInputField
                      as="textarea"
                      rows={3}
                      value={question[i + 3].question}
                      key={i}
                      onChange={(e) => onQuestionChange(e, i)}
                    />
                  </div>
                  <div className="d-flex align-items-start mt-4">
                    {questionCount >= 1 && (
                      <div
                        className="d-flex align-items-center delete-experience m-0"
                        onClick={() => {
                          removeQuestion(i);
                        }}
                      >
                        <FaTrash className="me-2" /> Delete this Question
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </section>
        <div className="intro-reg-btn" onClick={onInternshipPost}>
          post
        </div>
      </div>
    </div>
  );
}

const template_value =
  "<h2>About the Opportunity/Internship</h2> <p><strong>About [Your Company Name]<br><br></strong>[A Brief about your company]<br><br>Read more about our core values and operating principles - here. [Company Website link]<br><br><strong>Roles &amp; Responsibilities</strong></p> <ul> <li>Mention Roles</li> <li>Mention Responsibilities</li> </ul> <p><strong>Qualifications/Prerequisites<br></strong></p> <ul> <li>Graduation and Department related requirements if any</li> <li>Wide experience with XYZ</li> <li>Solid foundations in XYZ</li> <li>Exposure to XYZ</li> </ul> <p><strong>Benefits and Perks</strong></p> <ul> <li>Flexible work hours [Example]</li> <li>Internship certificate and Letter of Recommendation</li> <li>&nbsp;</li> </ul> <p>[Addition information / Policies like Equal Opportunities]<br><br>[a small write up on the above information/policy]</p> <p>[Contact/Email of a person for enquiring more about this opportunity]</p>";

export default InternshipPosting;
