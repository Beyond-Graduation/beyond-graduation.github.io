import React, { useState, useEffect } from "react";
import "./AdminNoticeView.css";
import axios from "../../axios";
import { CgAttachment } from "react-icons/cg";

function AdminNoticeView() {
  const token = localStorage.getItem("authKey");
  const [notices, setNotices] = useState([]);

  const getData = async () => {
    await axios({
      method: "get",
      url: "notice/",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
		console.log(res.data);
        setNotices(res.data);
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
    <div className="admin-notice-view pb-5 mb-5">
      <div className="admin-notice-view-head">General Notices</div>
      <div className="admin-notice-view-cnt mt-5">
        {notices.map((notice, i) => {
          var date = new Date(notice.dateUploaded);
          return (
            <div className="notice-view-card d-flex align-items-center mt-3">
              <div className="not-view-left text-center">
                <div className="month">
                  {date.toLocaleDateString("en-us", {
                    month: "short",
                  })}
                </div>
                <div className="date">{date.getDate()}</div>
                <div className="year">{date.getFullYear()}</div>
              </div>
              <div className="not-view-right">
                <div className="title">
                  {i + 1}. {notice.title}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminNoticeView;
