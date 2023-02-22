import React, { useEffect, useRef, useState } from "react";
import "./CreateBlog.css";
import { Editor } from "@tinymce/tinymce-react";
import FileInput from "../../../components/FileInput/FileInput";
import { useStateValue } from "../../../reducer/StateProvider";
import { toast } from "react-toastify";
import axios from "../../../components/axios";
import AnimatedInputField from "../../../components/AnimatedInputField/AnimatedInputField";
import { MutliDropdown } from "../../../components/CustomDropdown/CustomDropdown";
import { useNavigate } from "react-router-dom";
import { deleteObject, ref } from "firebase/storage";
import storage from "../../../firebase";

function CreateBlog() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const editorRef = useRef();
  const [blogImg, setBlogImg] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const [blogDetails, setBlogDetails] = useState({
    blogId: "",
    userId: "",
    firstName: "",
    lastName: "",
    title: "",
    domain: [],
    content: "",
    abstract: "",
    imagePath: "",
  });

  const handleBlogContentChange = (e) => {
    setBlogDetails({ ...blogDetails, content: editorRef.current.getContent() });
  };

  useEffect(() => {
    if (userData) {
      let blogId = "blog";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 5; i++) {
        blogId += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      setBlogDetails({
        ...blogDetails,
        blogId: blogId,
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setBlogDetails({ ...blogDetails, [e.target.name]: e.target.value });
  };

  const onBlogImageChange = (e) => {
    if (blogDetails.imagePath) {
      var storageRef = ref(storage, blogDetails.imagePath);
      deleteObject(storageRef)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong !!!");
        });
    }

    setBlogDetails({ ...blogDetails, imagePath: e });
  };

  const onSubmitBlog = async () => {
    if (!creating) {
      let token =
        localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
      if (
        blogDetails.title === "" ||
        blogDetails.domain === "" ||
        blogDetails.abstract === ""
      ) {
        toast.error("Please fill all the fields");
        return;
      } else if (
        editorRef.current.getContent({ format: "text" }).length < 500
      ) {
        toast.error("Blog must contain at least 500 characters");
        return;
      } else if (blogDetails.abstract.length < 30) {
        toast.error("Description must contain at least 30 characters");
        return;
      } else if (blogDetails.abstract.length > 200) {
        toast.error("Description must contain less than 200 characters");
        return;
      } else if (blogDetails.imagePath === "") {
        toast.error("Upload Blog Image !!");
        return;
      }

      setCreating(true);
      await axios({
        method: "post",
        url: "blog/create",
        data: blogDetails,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          toast.success("Blog published successfully");
          navigate("/dashboard");
        })
        .catch((e) => {
          toast.error("Something went wrong !!");
          setCreating(false);
        });
    }
  };

  const domainOptions = [
    { value: "webevelopment", label: "Web Development" },
    { value: "appevelopment", label: "App Development" },
    { value: "machineLearning", label: "Machine Learning" },
    { value: "dataScience", label: "Data Science" },
    { value: "blockChain", label: "Block Chain" },
  ];

  const handleDomainChange = (e) => {
    const areas = [];
    e.forEach((item) => {
      areas.push(item.label);
    });
    setBlogDetails({ ...blogDetails, domain: areas });
  };

  useEffect(() => {
    if (
      localStorage.getItem("userType") !== "alumni" ||
      sessionStorage.getItem("userType") !== "alumni"
    )
      navigate("/dashboard");
  }, []);

  return (
    <div className="create-blog">
      <div className="create-blog-cnt">
        <div className="create-blog-head">Create Blog</div>
        <div className="d-flex">
          <div>
            <div className="d-flex">
              <div>
                <AnimatedInputField
                  name="title"
                  title="Title"
                  className="light-mode"
                  onChange={handleChange}
                />
              </div>
              <div className="ms-5 mt-4 light-mode">
                <MutliDropdown
                  title="Domain"
                  options={domainOptions}
                  onChange={(e) => handleDomainChange(e)}
                />
              </div>
            </div>
            <div className="d-flex">
              <div>
                <AnimatedInputField
                  as="textarea"
                  name="abstract"
                  title="Description"
                  rows={4}
                  className="mt-5 light-mode"
                  onChange={handleChange}
                />
              </div>
              <div className="blog-img-upload ms-5 mt-4 d-flex align-items-center justify-content-center">
                <FileInput
                  label="Upload Blog Image"
                  content="blog"
                  type="image"
                  onUpload={onBlogImageChange}
                  onChange={(e) => {
                    if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
                      alert("not an image");
                    else setBlogImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="blog-img-thumb">
            {blogImg !== "" ? <img src={blogImg} alt="" /> : null}
          </div>
        </div>
        <div className="mt-5">
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            onSelectionChange={handleBlogContentChange}
          />
          <div
            type="button"
            onClick={onSubmitBlog}
            className="mt-4 create-blog-btn"
          >
            Publish
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
