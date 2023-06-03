import React, { useEffect, useState } from "react";
import { CgAttachment } from "react-icons/cg";
import axios from "../../../../components/axios";
import { TbNews } from "react-icons/tb";
import "./InternshipView.css";
import parse from "html-react-parser";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { GiTakeMyMoney } from "react-icons/gi";

function InternshipView() {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");
  const [internships, setInternships] = useState([]);
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getData = async () => {
    await axios({
      method: "get",
      url: "internship/view_internships",
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
        {userType === "alumni" ? (
          <Link to="/internships/post">
            <div className="create-notice-btn  d-flex align-items-center">
              <GiTakeMyMoney className="me-2" /> post internship
            </div>
          </Link>
        ) : null}

        <div className="internship-heading">Internships</div>
        <div className="internship-cnt">
          {internships.map((internship, i) => {
            //var date = new Date(notice.dateUploaded);
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
                      {userType !== "alumni" && (
                        <div
                          className="apply-button"
                          onClick={() => {
                            setCurrent(internship);
                            handleShow();
                          }}
                        >
                          Apply
                        </div>
                      )}
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
            {current.role}{" "}
            <span className="intern-compname">({current.companyName})</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {current.description && parse(current.description)}
        </Modal.Body>
        {userType !== "alumni" && (
          <Modal.Footer>
            <Button
              onClick={() =>
                navigate(`/internships/apply/${current.internshipId}`)
              }
            >
              Apply
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}

export default InternshipView;
