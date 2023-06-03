import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import storage from "../../../firebase";
import { useStateValue } from "../../../reducer/StateProvider";
import axios from "../../../components/axios";
import "./PublishNotice.css";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import FileInput from "../../../components/FileInput/FileInput";
import { Form } from "react-bootstrap";

function PublishNotice() {
  const navigate = useNavigate();
  const [{ userData, userId }, dispatch] = useStateValue();

  const [creating, setCreating] = useState(false);
  const [fileName, setFileName] = useState("");
  const [noticeDetails, setNoticeDetails] = useState({
    noticeId: "",
    userId: "",
    firstName: "",
    lastName: "",
    title: "",
    content: "",
    attachmentPath: "",
    noticeType: "Public",
  });

  const handleInputChange = (e) => {
    setNoticeDetails({ ...noticeDetails, [e.target.name]: e.target.value });
  };

  const onAttachmentChange = (e) => {
    if (noticeDetails.attachmentPath) {
      var storageRef = ref(storage, noticeDetails.attachmentPath);
      deleteObject(storageRef)
        .then((res) => {
          //console.log(res);
        })
        .catch((err) => {
          //console.log(err);
          toast.error("Something went wrong !!!");
        });
    }

    setNoticeDetails({ ...noticeDetails, attachmentPath: e });
  };

  const onPublishNotice = async () => {
    if (!creating) {
      let token =
        localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
      if (noticeDetails.title === "" || noticeDetails.content === "") {
        toast.error("Please fill all the fields");
        return;
      } else if (noticeDetails.content.length < 10) {
        toast.error("Notice Content must contain at least 10 characters");
        return;
      }

      setCreating(true);
      await axios({
        method: "post",
        url: "notice/create",
        data: noticeDetails,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          toast.success("Notice will be published after verification");
          navigate("/");
        })
        .catch((e) => {
          toast.error("Something went wrong !!");
          setCreating(false);
        });
    }
  };

  useEffect(() => {
    if (userData) {
      let noticeId = "not";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 5; i++) {
        noticeId += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }

      setNoticeDetails({
        ...noticeDetails,
        noticeId: noticeId,
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    }
  }, [userData]);

  useEffect(() => {
    //console.log(noticeDetails);
  }, [noticeDetails]);

  useEffect(() => {
    let userType =
      localStorage.getItem("userType") || sessionStorage.getItem("userType");
    if (userType !== "alumni") navigate("/dashboard");
  }, []);

  return (
    <div className="notices-publish">
      <div className="notices-publish-cnt">
        <div className="notice-heading">Publish Notice</div>
        <div className="admin-notice-pub-cnt p-5 pt-3">
          <div className="d-flex align-items-baseline">
            <AnimatedInputField
              name="title"
              title="Title"
              className="light-mode mb-5"
              onChange={handleInputChange}
            />
            <Form
              className="d-flex gap-3 notice-type ms-5"
              onChange={handleInputChange}
            >
              <Form.Check
                type="radio"
                label="Public Notice"
                name="noticeType"
                value="Public"
                defaultChecked
              />
              <Form.Check
                type="radio"
                label="Alumni Only"
                name="noticeType"
                value="Alumni"
              />
            </Form>
          </div>
          <AnimatedInputField
            as="textarea"
            name="content"
            title="Content"
            className="light-mode mb-5"
            rows={5}
            onChange={handleInputChange}
          />
          <div>
            <FileInput
              label="Upload Attachment"
              type="file"
              content="notice-attachment"
              onUpload={onAttachmentChange}
              onChange={(e) => {
                setFileName(e);
              }}
            />
            <span className="uploaded-file-name">{fileName}</span>
          </div>
        </div>
        <div className="publish-btn mt-3" onClick={onPublishNotice}>
          PUBLISH
        </div>
      </div>
    </div>
  );
}

export default PublishNotice;
