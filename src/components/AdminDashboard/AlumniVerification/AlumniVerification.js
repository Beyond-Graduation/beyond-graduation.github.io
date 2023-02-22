import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "../../axios";
import "./AlumniVerification.css";

function AlumniVerification() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [pending, setPending] = useState([]);
  const [currUser, setCurrUser] = useState("");
  const ref = useRef(null);

  const getData = async () => {
    await axios({
      method: "get",
      url: "admin/pending_alumni_list",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setPending(res.data);
      }
    });
  };

  const approveAlumni = async (userId) => {
    // console.log(userId);
    await axios({
      method: "post",
      url: "admin/alumni_approve",
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: {
        userId: userId,
        approved: 1,
      },
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast.success("Alumni Approved");
        getData();
      }
    });
  };

  const rejectAlumni = async () => {
    const msg = ref.current.value;

    if (msg.length < 10) {
      toast.error("Message length must be more than 10 characters");
    } else {
      await axios({
        method: "post",
        url: "admin/alumni_approve",
        headers: {
          Authorization: `bearer ${token}`,
        },
        data: {
          userId: currUser,
          approved: 0,
          remarks: msg,
        },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("Alumni Rejected");
          ref.current.value = "";
          setOverlayOpen(false);
          getData();
        }
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="reject-overlay" hidden={!overlayOpen}>
        <div className="reject-overlay-cnt d-flex flex-column">
          <div className="reject-overlay-head d-flex align-items-center justify-content-between">
            <div>Reason for Rejection</div>
            <AiOutlineClose
              className="close-btn"
              onClick={() => setOverlayOpen(false)}
            />
          </div>
          <div className="text-center my-3">
            <textarea
              name="reject-msg"
              placeholder="Enter the reason for profile rejection"
              rows="5"
              ref={ref}
            />
          </div>
          <div className="approve-btn reject me-4" onClick={rejectAlumni}>
            reject
          </div>
        </div>
      </div>
      <div className="admin-notice-view-head">Pending Alumni Verification</div>
      <div className="pending-container">
        {pending.length !== 0 ? (
          pending.map((alu) => (
            <div className="pending-card">
              <div className="p-card-top">
                <div className="p-name">
                  {alu.firstName} {alu.lastName}
                </div>
                <div className="p-department">{alu.department}</div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="d-flex">
                    <div className="p-degree p-field">
                      <span>Degree:</span> {alu.degree}
                    </div>
                    <div className="ms-5 p-yearGrad p-field">
                      <span>Year of Graduation:</span> {alu.yearGraduation}
                    </div>
                  </div>
                  <div className="p-admissionId p-field">
                    <span>Admission Number :</span> {alu.admissionId}
                  </div>
                  <div className="p-email p-field">
                    <span>Email:</span> {alu.email}
                  </div>
                </div>
                <div className="">
                  <div
                    className="approve-btn"
                    onClick={() => approveAlumni(alu.userId, 1)}
                  >
                    Approve
                  </div>
                  <div
                    className="approve-btn reject"
                    onClick={() => {
                      setOverlayOpen(!overlayOpen);
                      setCurrUser(alu.userId);
                    }}
                  >
                    Reject
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-pending m-4">No Pending Verifications</div>
        )}
      </div>
    </div>
  );
}

export default AlumniVerification;
