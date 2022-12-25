import React, { useState } from "react";
import { useEffect } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import FileViewOverlay from "../../../components/FileViewOverlay/FileViewOverlay";

function StudentProfile({ data }) {
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    console.log(data);
  }, []);

  return (
    <div className="profile-main">
      <div className="profile-top d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img src={data.profilePicPath} alt="" />
          <div className="profile-top-name">
            {data.firstName} {data.lastName}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <CircularProgressbar
            value={data.profileCompletionPerc}
            text={`${data.profileCompletionPerc}%`}
            background
            styles={buildStyles({
              backgroundColor: "#ffffffa0",
              pathColor: "#344E41",
              trailColor: "transparent",
              strokeLinecap: "round",
              textSize: "20px",
            })}
          />
          <Link to="/update">
            <div className="prof-update-button">Update your profile</div>
          </Link>
        </div>
      </div>
      <div className="d-flex">
        <div className="profile-left">
          <div className="p-person-info">
            <div className="prof-blk-head">Personal Information</div>
            <div className="d-flex">
              <div className="prof-det">
                <div className="prof-det-head">First Name</div>
                <div className="prof-det-body">{data.firstName}</div>
              </div>
              <div className="prof-det">
                <div className="prof-det-head">Last Name</div>
                <div className="prof-det-body">{data.lastName}</div>
              </div>
            </div>
            <div className="d-flex">
              <div className="prof-det">
                <div className="prof-det-head">Email</div>
                <div className="prof-det-body">{data.email}</div>
              </div>
              <div className="prof-det">
                <div className="prof-det-head">Phone Number</div>
                <div className="prof-det-body">{data.phone}</div>
              </div>
            </div>
            <div className="prof-address-box d-flex align-items-center">
              <div className="prof-det-head mt-0">Address</div>
              <div className="prof-address">{data.address ? data.address : "Address not provided"}</div>
            </div>
          </div>
          <div className="p-person-info pb-5 mb-5 border-0">
            <div className="prof-blk-head">Educational Information</div>
            <div className="ms-4">
              <div className="prof-blk-subhead">12th Grade</div>
              <div className="ms-4 d-flex">
                <div className="prof-det">
                  <div className="prof-det-head">Board</div>
                  <div className="prof-det-body">
                    {data.higherSecondary.board}
                  </div>
                </div>
                <div className="prof-det">
                  <div className="prof-det-head">Percentage</div>
                  <div className="prof-det-body">
                    {data.higherSecondary.cgpa}%
                  </div>
                </div>
              </div>
            </div>
            <div className="ms-4 mt-4">
              <div className="prof-blk-subhead">Undergraduate Degree</div>
              <div className="ms-4 d-flex">
                <div className="prof-det-small">
                  <div className="prof-det-head">Degree</div>
                  <div className="prof-det-body det-small">{data.degree}</div>
                </div>
                <div className="ms-3 prof-det w-auto">
                  <div className="prof-det-head">Branch</div>
                  <div className="prof-det-body prof-det-department">
                    {data.department}
                  </div>
                </div>
              </div>
              <div className="ms-4 d-flex">
                <div className="prof-det-small">
                  <div className="prof-det-head">Graduation Year</div>
                  <div className="prof-det-body det-small">
                    {data.expectedGraduationYear}
                  </div>
                </div>
                <div className="ms-3 prof-det-small">
                  <div className="prof-det-head">Year of Study</div>
                  <div className="prof-det-body det-small">
                    {data.expectedGraduationYear - data.yearOfJoining}
                  </div>
                </div>
                <div className="ms-3 prof-det-small">
                  <div className="prof-det-head">CGPA</div>
                  <div className="prof-det-body det-small">{data.cgpa}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-right">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Areas of Interest</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex flex-wrap">
                  {data.areasOfInterest.map((interest, i) => (
                    <div className="interest-box my-2" key={i}>
                      {interest}
                    </div>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Projects</Accordion.Header>
              <Accordion.Body>
                {data.projects.length > 0
                  ? data.projects.map((proj) => (
                      <div className="project">
                        <div className="d-flex justify-content-between  align-items-center">
                          <div className="d-flex align-items-center ">
                            <div className="proj-title">{proj.title}</div>
                            <div className="proj-role ms-2">
                              ( {proj.role} )
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="proj-date">
                              {proj.from} - {proj.to}
                            </div>
                          </div>
                        </div>
                        <div className="proj-contribution">
                          {proj.description}
                        </div>
                        <div className="proj-domain">
                          Domain : {proj.domain}
                        </div>
                      </div>
                    ))
                  : "Nothing to show"}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Internships</Accordion.Header>
              <Accordion.Body>
                {data.internships.length > 0
                  ? data.internships.map((proj) => (
                      <div className="project">
                        <div className="d-flex justify-content-between  align-items-center">
                          <div className="d-flex align-items-center ">
                            <div className="proj-title">{proj.company}</div>
                            <div className="proj-role ms-2">
                              ( {proj.role} )
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="proj-date">
                              {proj.from} - {proj.to}
                            </div>
                          </div>
                        </div>
                        <div className="proj-contribution">
                          {proj.contribution}
                        </div>
                      </div>
                    ))
                  : "Nothing to show"}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Relevant Links</Accordion.Header>
              <Accordion.Body>
                <div className="relevant-link">
                  <span className="link-head">Github : </span>
                  {data.github ? (
                    <a
                      href={data.github}
                      target="_blank"
                      className="link"
                      rel="noreferrer"
                    >
                      {data.github}
                    </a>
                  ) : (
                    "Not Provided"
                  )}
                </div>
                <div className="relevant-link mt-1">
                  <span className="link-head">LinkedIn : </span>
                  {data.linkedin ? (
                    <a
                      href={data.linkedin}
                      target="_blank"
                      className="link"
                      rel="noreferrer"
                    >
                      {data.linkedin}
                    </a>
                  ) : (
                    "Not Provided"
                  )}
                </div>
                <div className="relevant-link mt-1">
                  <span className="link-head">Other Links : </span>
                  {data.otherLinks ? (
                    <a
                      href={data.otherLinks}
                      target="_blank"
                      className="link"
                      rel="noreferrer"
                    >
                      {data.otherLinks}
                    </a>
                  ) : (
                    "Not Provided"
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="prof-resume">
            <button
              className="resume-button"
              onClick={() => setShowResume(true)}
            >
              View Your Resume <AiOutlineFileDone />
            </button>
          </div>
        </div>
      </div>
      <FileViewOverlay
        url={data.resume}
        name={{ firstName: data.firstName, lastName: data.lastName }}
        showOverlay={showResume}
        closeOverlay={() => setShowResume(false)}
      />
    </div>
  );
}

export default StudentProfile;
