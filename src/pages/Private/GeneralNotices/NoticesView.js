import React, { useEffect, useState } from "react";
import { CgAttachment } from "react-icons/cg";
import axios from "../../../components/axios";
import { TbNews } from "react-icons/tb";
import "./NoticesView.css";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";

function NoticesView() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");
  const [notices, setNotices] = useState([]);

  const getData = async () => {
    await axios({
      method: "get",
      url: userType === "alumni" ? "notice?filter=All" : "notice/",
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setNotices(res.data);
      }
    });
  };

  const filterChange = async (e) => {
    var path;
    if (e.target.value === "All") path = "notice?filter=All";
    else if (e.target.value === "Alumni") path = "notice?filter=Alumni";
    await axios({
      method: "get",
      url: path,
      headers: {
        Authorization: `bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
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
    <div className="notices-view">
      <div className="notices-view-cnt">
        {userType === "alumni" ? (
          <Link to="/notices/publish">
            <div className="create-notice-btn  d-flex align-items-center">
              <TbNews className="me-1" /> publish notice
            </div>
          </Link>
        ) : null}
        <div className="notice-heading">General Notices</div>
        <div>
          <Form className="d-flex gap-3 filter-notice">
            <Form.Check
              type="radio"
              label="All"
              name="filter"
              value="All"
              defaultChecked
              onChange={filterChange}
            />
            <Form.Check
              type="radio"
              label="Alumni Only"
              name="filter"
              value="Alumni"
              onChange={filterChange}
            />
          </Form>
        </div>
        <div className="notices-cnt">
          {notices.length !== 0 ? (
            notices.map((notice, i) => {
              var date = new Date(notice.dateUploaded);
              return (
                <div className="notice-view-card d-flex align-items-center mt-4">
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
            })
          ) : (
            <div className="no-notices text-center">No Notices</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoticesView;
