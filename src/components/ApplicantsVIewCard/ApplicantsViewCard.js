import React, { useEffect, useState } from "react";
import "./ApplicantsViewCard.css";
import avatarIcon from "../../assets/images/avatar.png";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

function ApplicantsViewCard({ data }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="profile-view-card-main app-card p-3 px-4 d-flex">
      <div className="prof-view-card-inner ms-0">
        <div className="pv-c-name">
          {data.firstName} {data.lastName}
        </div>
        <div className="pv-c-dept mt-2">{data.branch}</div>

        <div className="d-flex flex-row justify-content-between w-100 mt-3">
          <Button
            onClick={() => navigate(`/student-profile/${data.studentId}`)}
          >
            View Profile
          </Button>
          <Button
            className="ms-4"
            onClick={() => {
              //setCurrent(internship);
              handleShow();
            }}
          >
            View Applications
          </Button>
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
              <b>{data.firstName} {data.lastName}</b>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-row justify-content-around fs-5">
            <div className="d-flex flex-column">
              <p>
                <b>Email :</b> {data.email}
              </p>
              <p>
                <b>Phone :</b> {data.phone}
              </p>
            </div>

            <div className="d-flex flex-column">
              <p>
                <b>Branch : </b>
                {data.branch}
              </p>
              <p>
                <b>CGPA :</b> {data.cgpa}
              </p>
            </div>
          </div>
          {data.qnas.map((ques, i) => {
            return (
              <div className="mb-3">
                <div>
                  <b>{i + 1}. {ques.question}</b>
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

export default ApplicantsViewCard;
