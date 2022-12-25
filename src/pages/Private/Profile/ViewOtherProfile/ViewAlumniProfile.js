import React, { useEffect, useState } from "react";
import "./ViewOtherProfile.css";
import { useParams } from "react-router-dom";
import axios from "../../../../components/axios";
import { toast } from "react-toastify";
import { Accordion } from "react-bootstrap";
import { AiFillHeart, AiOutlineFileDone, AiOutlineHeart } from "react-icons/ai";
import FileViewOverlay from "../../../../components/FileViewOverlay/FileViewOverlay";
import { useStateValue } from "../../../../reducer/StateProvider";

function ViewStudentProfile() {
  const [{ userData }, dispatch] = useStateValue();
  const { userId } = useParams();
  const [data, setData] = useState({});
  const [showResume, setShowResume] = useState(false);
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("authKey");
  const [isFav, setIsFav] = useState(false);

  const toggleFavourite = async () => {
    axios({
      method: "post",
      url: `student/favAlumAdd`,
      data: { alumId: userId },
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        setIsFav(!isFav)
        dispatch({
          type: "SET_USER_DATA",
          item: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!!");
      });
  };

  useEffect(() => {
    const getData = async () => {
      await axios({
        method: "get",
        url: `alumni/alumni_details?userId=${userId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!!");
        });
    };

    getData();
  }, []);

  useEffect(() => {
    if (data.isFavourite) setIsFav(true);
  }, [data]);

  return (
    <>
      <div className="view-profile">
        <div className="profile-top d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img src={data.profilePicPath} alt="" />
            <div className="profile-top-name">
              {data.firstName} {data.lastName}
            </div>
          </div>
          <div>
            {userType.toLowerCase() === "student" ? (
              <div
                className={`fav-btn ${isFav ? "active" : ""}`}
                onClick={toggleFavourite}
              >
                {isFav ? (
                  <div className="d-flex align-items-center">
                    <AiFillHeart className="me-2" /> unfavourite
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <AiOutlineHeart className="me-2" /> FAVOURITE
                  </div>
                )}
              </div>
            ) : null}
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
                <div className="prof-det email">
                  <div className="prof-det-head">Email</div>
                  <div className="prof-det-body">{data.email}</div>
                </div>
              </div>
            </div>
            <div className="p-person-info pb-5 mb-5 border-0">
              <div className="prof-blk-head">Program Graduated from CET</div>

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
                      {data.yearGraduation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-right">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Domain</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-wrap">
                    {data.areasOfInterest?.map((interest, i) => (
                      <div className="interest-box my-2" key={i}>
                        {interest}
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Work Experience</Accordion.Header>
                <Accordion.Body>
                  {data.workExperience?.length > 0
                    ? data.workExperience.map((proj) => (
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
                            {proj.description}
                          </div>
                        </div>
                      ))
                    : "Nothing to show"}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Publications</Accordion.Header>
                <Accordion.Body>
                  {data.publications?.length > 0
                    ? data.publications?.map((proj) => (
                        <div className="project">
                          <div className="d-flex justify-content-between  align-items-center">
                            <div className="d-flex align-items-center ">
                              <div className="proj-title">{proj.title}</div>
                              <div className="proj-role ms-2">
                                ( {proj.domain} )
                              </div>
                            </div>
                          </div>
                          <div className="proj-contribution">
                            {proj.description}
                          </div>
                          <a
                            href={proj.link}
                            target="_blank"
                            className="proj-contribution"
                            rel="noreferrer"
                          >
                            {proj.link}
                          </a>
                        </div>
                      ))
                    : null}
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
                View Resume <AiOutlineFileDone />
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
    </>
  );
}

export default ViewStudentProfile;
