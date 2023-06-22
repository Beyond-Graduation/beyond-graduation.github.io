import React, { useState, useEffect, useRef } from "react";
import "./EmailAlumniView.css";
import axios from "../../axios";
import { CgAttachment } from "react-icons/cg";
import { Form, Button } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function EmailAlumniView() {
  const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const handleBlogContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getContent());
    }
  };

  const handleUpload = (file, cb) => {
    // Handle file upload logic here
  };

  const handleSubmit = async (e) => {
    if (!creating) {
    e.preventDefault();

    const data = {
      subject,
      content,
    };
    
    try {
      setCreating(true);
      const response = await axios.post("admin/alumni_broadcast", data, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }).then((res) => {
        toast.success("Email Broadcasted to all Alumni");
        navigate("/dashboard");
      })
      .catch((e) => {
        toast.error("Something went wrong !!");
        setCreating(false);
      });;
      // Handle successful response
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }
  };

  useEffect(() => {
    // Initialize data or perform other actions on component mount

    return () => {
      // Cleanup or perform other actions on component unmount
    };
  }, []);

  return (
    <div className="admin-notice-view pb-5 mb-5">
      <div className="admin-notice-view-head">Broadcast Emails to Alumni</div>


      <div className="email-form">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="subject">
            <Form.Label><b>Subject</b></Form.Label>
            <Form.Control
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="content">
            <Form.Label><b>Content</b></Form.Label>
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              onSelectionChange={handleBlogContentChange}
              init={{
                plugins: [
                  "a11ychecker",
                  "advlist",
                  "advcode",
                  "advtable",
                  "autolink",
                  "checklist",
                  "export",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "powerpaste",
                  "fullscreen",
                  "formatpainter",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                file_picker_callback: function (cb, value, meta) {
                  var input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = function () {
                    var file = this.files[0];

                    var reader = new FileReader();
                    reader.onload = function () {
                      handleUpload(file, (url) => {
                        cb(url, { title: file.name });
                      });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                },
                toolbar:
                  "undo redo | casechange blocks | link image | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Send Email
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default EmailAlumniView;
