import React, { useState } from "react";
import "./InternshipApplication.css";
import AnimatedInputField from "../../../../components/AnimatedInputField/AnimatedInputField";
import { MutliDropdown } from "../../../../components/CustomDropdown/CustomDropdown";
import axios from "../../../../components/axios";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./InternshipApplication.css";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function InternshipApplication() {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  const [formDetails, setFormDetails] = useState({
    alumniId: "",
    applicationId: "",
    internshipId: "",
    email: "",
    phone: "",
    cgpa: "",
    qnas: [],
    yearofStudy: "",
  });
  const [questions, setQuestions] = useState([
    { question: "Why should you be selected for this role ?", answer: "" },
    {
      question:
        "Are you available for the time duration applicable to this role ?",
      answer: "",
    },
    { question: "t work experience. Share links (if any) ?", answer: "" },
  ]);

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const handleQuestionAnswerChange = (e, i) => {
    let temp = questions;
    temp[i].answer = e.target.value;
    setFormDetails({ ...formDetails, qnas: temp });
  };

  const getInternshipDetails = async () => {
    let token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    await axios({
      method: "get",
      url: `internship/view_internships?internshipId=${internshipId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        let tempQues = questions;
        res.data.qnas.forEach((q) => {
          tempQues = [...tempQues, { question: q.question, answer: "" }];
        });
        let applId = "application";
        const possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 3; i++) {
          applId += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );
        }
        setFormDetails({
          ...formDetails,
          alumniId: res.data.alumniId,
          applicationId: applId,
          internshipId: internshipId,
        });
        setQuestions(tempQues);
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
      });
  };

  useEffect(() => {
    getInternshipDetails();
  }, []);

  const onApplicationSubmit = async () => {
    let token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    await axios({
      method: "post",
      url: "internship/apply",
      data: formDetails,
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success("Applied successfully");
        navigate("/dashboard");
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
      });
  };

  useEffect(() => {
    console.log(formDetails);
  }, [formDetails]);

  return (
    <div className="main-intro">
      <div className="main-container">
        <h1 className="main-heading">Internship Application Form</h1>
        <div className="d-flex">
          <div>
            <section className="intro-section mt-5">
              <div className="head">Personal Information</div>
              <div className="intro-form-inner">
                <div className="d-flex">
                  <AnimatedInputField
                    name="email"
                    title="Email"
                    onChange={handleChange}
                  />
                  <AnimatedInputField
                    name="phone"
                    title="Phone"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className="intro-section mt-5">
          <div className="head">Educational Qualification</div>

          <div className="m-4 mt-3">
            <div className="sub-head">Undergraduate Degree</div>
            <div className="intro-form-inner">
              <div className="d-flex">
                <AnimatedInputField
                  name="cgpa"
                  title="CGPA"
                  onChange={handleChange}
                />
                <AnimatedInputField
                  name="yearofStudy"
                  title="Year of Study"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Cover Letter</div>
          <div className="intro-form-inner">
            <div className="cover-letter w-75 mt-4">
              <div className="sub-head">
                Why should you be selected for this role ?
              </div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                placeholder="Answer this question carefully and add relevant information like your skills/experience and why you want to be a part of this project/internship."
                rows={5}
                cols={10}
                //className="mt-5"
                onChange={(e) => handleQuestionAnswerChange(e, 0)}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Availability</div>
          <div className="intro-form-inner">
            <div className="cover-letter w-75 mt-4">
              <div className="sub-head">
                Are you available for the time duration applicable to this role
                ?
              </div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                placeholder="e.g. I am available full time for the next ___ duration."
                rows={3}
                cols={10}
                //className="mt-5"
                onChange={(e) => handleQuestionAnswerChange(e, 1)}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Assessment</div>
          <div className="intro-form-inner">
            <div className="cover-letter w-75 mt-4">
              <div className="sub-head">
                Past work experience. Share links (if any) ?
              </div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                placeholder="Answer"
                rows={4}
                cols={10}
                //className="mt-5"
                onChange={(e) => handleQuestionAnswerChange(e, 2)}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Other Questions</div>
          <div className="intro-form-inner">
            {questions.map((ques, index) => {
              if (index > 2)
                return (
                  <>
                    <div className="cover-letter w-75 mt-4">
                      <div className="sub-head">{ques.question}</div>
                      <AnimatedInputField
                        as="textarea"
                        //name="About the company"
                        placeholder="Answer"
                        rows={4}
                        cols={10}
                        //className="mt-5"
                        onChange={(e) => handleQuestionAnswerChange(e, index)}
                      />
                    </div>
                  </>
                );
              else return <></>;
            })}
          </div>
        </section>
        <div className="intro-reg-btn" onClick={onApplicationSubmit}>
          apply
        </div>
      </div>
    </div>
  );
}

export default InternshipApplication;
