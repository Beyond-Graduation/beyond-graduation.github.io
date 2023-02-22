import React, { useEffect, useState } from "react";
import { CgAttachment } from "react-icons/cg";
import { toast } from "react-toastify";
import axios from "../../../components/axios";
import "./AdminNoticeVerification.css";

function AdminNoticeVerification() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const [pendingNotices, setPendingNotices] = useState([]);

  const getData = async () => {
    await axios({
      method: "get",
      url: "admin/pending_notice_list",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setPendingNotices(res.data);
      }
    });
  };

  const approveNotice = async (noticeId, approve) => {
    await axios({
      method: "post",
      url: "admin/notice_approve",
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: {
        noticeId: noticeId,
        approved: approve,
      },
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        approve
          ? toast.success("Notice Approved")
          : toast.success("Notice Rejected");
        getData();
      }
    });
  };

  const downloadNotice = (url, title) => {
    fetch(url)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", title);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        return Promise.reject({ Error: "Something Went Wrong", err });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="admin-notice-view-head mb-5">
        General Notices Verification
      </div>
      {pendingNotices.length !== 0 ? (
        pendingNotices.map((notice) => (
          <div className="notice-ver-card mt-4">
            <div className="d-flex">
              <div className="not-ver-left text-center d-flex flex-column justify-content-center">
                <div className="month">
                  {new Date(notice.dateUploaded).toLocaleDateString("en-us", {
                    month: "short",
                  })}
                </div>
                <div className="date">
                  {new Date(notice.dateUploaded).getDate()}
                </div>
                <div className="year">
                  {new Date(notice.dateUploaded).getFullYear()}
                </div>
              </div>
              <div className="not-ver-mid">
                <div className="title">{notice.title}</div>
                <div className="name mt-1">
                  <span>By:</span> {notice.firstName} {notice.lastName}
                </div>
                <div className="content mt-1">{notice.content}</div>
                {notice.attachmentPath ? (
                  <div
                    className="attachment mt-2 d-flex align-items-center"
                    onClick={() =>
                      downloadNotice(notice.attachmentPath, notice.title)
                    }
                  >
                    <CgAttachment className="me-1" /> Download Attachment
                  </div>
                ) : null}
              </div>
              <div className="not-ver-right">
                <div
                  className="approve-btn text-center"
                  onClick={() => approveNotice(notice.noticeId, 1)}
                >
                  approve
                </div>
                <div
                  className="approve-btn reject text-center mt-3"
                  onClick={() => approveNotice(notice.noticeId, 0)}
                >
                  reject
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-pending m-4">No Pending Verifications</div>
      )}
    </div>
  );
}

export default AdminNoticeVerification;
