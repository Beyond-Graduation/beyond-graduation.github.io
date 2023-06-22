import React, { useEffect, useState } from "react";
import { CgAttachment } from "react-icons/cg";
import axios from "../../../../components/axios";
import { TbNews } from "react-icons/tb";
import "./StudentsViewApplications.css";
import parse from "html-react-parser";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function StudentViewApplications() {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");
  const [internships, setInternships] = useState([]);
  const [show, setShow] = useState(false);
  const [close, setClose] = useState(false); //change1
  const [current, setCurrent] = useState({});

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const getData = async () => {
    await axios({
      method: "get",
      url: "internship/my_application_view",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setInternships(res.data);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="internship-view">
      <div className="internship-view-cnt">
        <div className="internship-heading">My Applications</div>

        <div className="internship-cnt">
          {internships.map((internship, i) => {
            return (
              <div
                className="internship-view-card d-flex align-items-center mt-4"
                onClick={() => {
                  setCurrent(internship);
                  handleShow();
                }}
              >
                <div className="w-100">
                  <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-column">
                      <div className="intern-role">{internship.role}</div>
                      <div className="intern-compname">
                        {internship.companyName}
                      </div>
                    </div>

                    <div className="d-flex flex-column">
                      <div className="intern-duration">
                        {internship.duration}
                      </div>
                      <div className="intern-stipend">{internship.stipend}</div>
                    </div>

                    <div className="d-flex flex-column">
                      <div className="intern-workType">
                        {internship.workingType}
                      </div>
                      {userType !== "alumni"}
                      <div
                        className="apply-button"
                        onClick={() => {
                          //setCurrent(internship);
                          handleShow();
                        }}
                      >
                        View Application Form
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span className="intern-compname fs-4">
              <b>
                {current.companyName}
                {/* {data.firstName} {data.lastName} */}
              </b>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-row justify-content-around fs-5">
            <div className="d-flex flex-column">
              <p>
                <b>Email :</b> {current.email}
              </p>
              <p>
                <b>Phone :</b> {current.phone}
              </p>
            </div>

            <div className="d-flex flex-column">
              <p>
                <b>Branch : </b>
                {current.branch}
              </p>
              <p>
                <b>CGPA :</b> {current.cgpa}
              </p>
            </div>
          </div>
          {current.qnas?.map((ques, i) => {
            return (
              <div className="mb-3">
                <div>
                  <b>
                    {i + 1}. {ques.question}
                  </b>
                </div>
                <div className="ms-3"> Ans: {ques.answer}</div>
              </div>
            );
          })}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default StudentViewApplications;
