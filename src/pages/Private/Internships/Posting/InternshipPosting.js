import React, { useState } from "react";
import "./InternshipPosting.css";
import AnimatedInputField from "../../../../components/AnimatedInputField/AnimatedInputField";
import { MutliDropdown } from "../../../../components/CustomDropdown/CustomDropdown";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function InternshipPosting() {
  // const [questionCount, setQuestionCount] = useState(0);
  // const [question, setQuestion] = useState([]);

  // const handleQuestionChange = (e, index) => {
  //   const newQuestion = [...question];
  //   setQuestion(newQuestion);
  //   //setFormDetails({ ...formDetails, workExperience: newExperience });
  // };

  // const addNewQuestion = () => {
  //   setQuestionCount(questionCount + 1);
  //   setQuestion([
  //     ...question,
  //     {
  //       qnas: "",

  //       // Contribution: "",
  //     },
  //   ]);
  // };

  // const removeQuestion = (index) => {
  //   const newQuestion = [...question];
  //   newQuestion.splice(index, 1);
  //   setQuestion(newQuestion);
  //   setQuestionCount(questionCount - 1);
  //   //setFormDetails({ ...formDetails, workExperience: newExperience });
  // };

  const WorkTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
  ];

  const handleWorkTypeChange = (e) => {
    const types = [];
    e.forEach((item) => {
      types.push(item.label);
    });
    //setFormDetails({ ...formDetails, areasOfInterest: areas });
  };

  const PerkOptions = [
    { value: "lor", label: "Letter of Recommendation" },
    { value: "cert", label: "Certificate" },
  ];

  const handlePerkChange = (e) => {
    const perks = [];
    e.forEach((item) => {
      perks.push(item.label);
    });
    //setFormDetails({ ...formDetails, areasOfInterest: areas });
  };

  return (
    <div classname="main-intro">
      <div className="main-container">
        <h1 className="main-heading">Internship Specifications</h1>
        <div className="d-flex">
          <div>
            <section className="intro-section mt-5">
              <div className="head">Personal Information</div>
              <div className="intro-form-inner">
                <div className="d-flex">
                  <AnimatedInputField name="firstName" title="First Name" />
                  <AnimatedInputField name="lastName" title="Last Name" />
                  <AnimatedInputField name="email" title="Email" />
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className="intro-section mt-5">
          <div className="head">Internship Details</div>
          <div className="intro-form-inner">
            <div className="d-flex">
              <AnimatedInputField name="role" title="Role" />
              <AnimatedInputField name="companyName" title="Company Name" />
              <AnimatedInputField name="stipend" title="Stipend" />
            </div>

            <div className="d-flex">
              <AnimatedInputField name="duration" title="Duration" />

              <div className="m-4 mt-3">
                <MutliDropdown
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
          <div className="head">Description</div>
          <div className="intro-form-inner">
            <div className="about-company mt-4">
              <div className="sub-head">About the company</div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                //title="About the company"
                rows={3}
                cols={50}
                //className="mt-5"
                //onChange={handleChange}
              />
            </div>

            <div className="about-internship mt-4">
              <div className="sub-head">About the internship</div>
              <AnimatedInputField
                as="textarea"
                // name="About the internship"
                // title="About the internship"
                rows={3}
                //onChange={handleChange}
              />
            </div>

            <div className="pre-requisite mt-4">
              <div className="sub-head">Pre-requisite/Skills required</div>
              <AnimatedInputField
                as="textarea"
                // name="About the company"
                // title="About the company"
                rows={3}
                //onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Perks</div>
          <div className="m-4 mt-3">
            <MutliDropdown
              title="Perks"
              options={PerkOptions}
              //defaultValue={defaultInterest}
              onChange={(e) => handlePerkChange(e)}
            />
          </div>
        </section>

        {/* <section className="intro-section mt-5">
          <div className="head d-flex">
            Questions for the Applicant
            <div
              className="add-question-button d-flex ms-3"
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
                  <div className="d-flex">
                    <AnimatedInputField
                      as="textarea"
                      rows={3}
                      onChange={(e) => handleQuestionChange(e, i)}
                    />
                  </div>
                  <div className="d-flex align-items-start mt-4">
                    {questionCount >= 1 && (
                      <div
                        className="d-flex align-items-center delete-question m-0"
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
        </section> */}
      </div>
    </div>
  );
}

export default InternshipPosting;
