import React, { useRef } from "react";
import "./CreateBlog.css";
import { Editor } from "@tinymce/tinymce-react";
import { MutliDropdown } from "../../../components/CustomDropdown/CustomDropdown";
import FileInput from "../../../components/FileInput/FileInput";

function CreateBlog() {
  const editorRef = useRef();

  const onSubmitBlog = () => {
    console.log(editorRef.current.getContent());
  };

  const domainOptions = [
    { value: "webevelopment", label: "Web Development" },
    { value: "appevelopment", label: "App Development" },
    { value: "machineLearning", label: "Machine Learning" },
    { value: "dataScience", label: "Data Science" },
    { value: "blockChain", label: "Block Chain" },
  ];

  return (
    <div className="create-blog">
      <div className="create-blog-cnt">
        <div className="create-blog-head">Create Blog</div>
        <div className="d-flex">
          <div>
            <div className="cb-head">Title</div>
            <input type="text" />
          </div>
          <div className="ms-5">
            <div className="cb-head">Domain</div>
            <div className="">
              <MutliDropdown
                title="Domain"
                options={domainOptions}
                onChange={(e) => {}}
              />
            </div>
          </div>
        </div>
        <div className="d-flex">
          <div>
            <div className="cb-head mt-3">Description</div>
            <textarea
              name="description"
              className="blog-desc"
              rows={4}
              id="desc"
              draggable={false}
            />
          </div>
          <div className="blog-img-upload ms-5 mt-4 d-flex align-items-center justify-content-center">
            <FileInput
              label="Upload Blog Image"
              type="image"
              onUpload={(e) => {
                console.log(e);
              }}
              onChange={(e) => {
                if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
                  alert("not an image");
                // else setProfilePic(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          <Editor onInit={(evt, editor) => (editorRef.current = editor)} />
          <button type="button" onClick={onSubmitBlog}>
            Submit
          </button>
        </div>
      </div>
      <FileInput />
    </div>
  );
}

export default CreateBlog;
