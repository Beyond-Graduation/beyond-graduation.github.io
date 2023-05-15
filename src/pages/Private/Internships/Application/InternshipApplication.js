import React, { useState } from "react";
import "./InternshipApplication.css";
import AnimatedInputField from "../../../../components/AnimatedInputField/AnimatedInputField";
import { MutliDropdown } from "../../../../components/CustomDropdown/CustomDropdown";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./InternshipApplication.css";

function InternshipApplication() {
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
        <h1 className="main-heading">Application Form</h1>
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
          <div className="head">Educational Qualification</div>

          <div className="m-4 mt-3">
            <div className="sub-head">Undergraduate Degree</div>
            <div className="intro-form-inner">
              <div className="d-flex">
                <AnimatedInputField name="degree" title="Degree" />
                <AnimatedInputField name="Branch" title="Branch" />
                <AnimatedInputField name="cgpa" title="CGPA" />
              </div>
              <div className="d-flex">
                <AnimatedInputField
                  name="expectedGraduationYear"
                  title="Year of Graduation"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Cover Letter</div>
          <div className="intro-form-inner">
            <div className="cover-letter mt-4">
              <div className="sub-head">
                Why should you be selected for this role ?
              </div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                title="{First Name}, answer this question carefully and add relevant information like your skills/experience and why you want to be a part of this project/internship."
                rows={5}
                cols={10}
                //className="mt-5"
                //onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Availability</div>
          <div className="intro-form-inner">
            <div className="cover-letter mt-4">
              <div className="sub-head">
                Are you available for the time duration applicable to this role
                ?
              </div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                title="e.g. I am available full time for the next ___ duration."
                rows={3}
                cols={10}
                //className="mt-5"
                //onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="intro-section mt-5">
          <div className="head">Assessment</div>
          <div className="intro-form-inner">
            <div className="cover-letter mt-4">
              <div className="sub-head">
                Past work experience. Share links (if any) ?
              </div>
              <AnimatedInputField
                as="textarea"
                //name="About the company"
                title="Answer"
                rows={4}
                cols={10}
                //className="mt-5"
                //onChange={handleChange}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InternshipApplication;
