import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import check from "../../assets/images/check.png";
import "./FileInput.css";
import { toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import { buildStyles } from "react-circular-progressbar";

const FileInput = ({
  name,
  label,
  value,
  type,
  onChange,
  onUpload,
  ...rest
}) => {
  const inputRef = useRef();
  const [file, setFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressShow, setProgressShow] = useState(false);

  const checkFileSize = () => {
    if (inputRef.current.files[0].size > 512000) {
      toast.error("Upload size must be less than 500KB");
      setFile("");
      return;
    }
    return 1;
  };

  const handleUpload = () => {
    setProgressShow(true);

    const fileName = new Date().getTime() + inputRef.current.files[0].name;
    const storageRef = ref(storage, `/files/${fileName}`);
    const uploadTask = uploadBytesResumable(
      storageRef,
      inputRef.current.files[0]
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploaded = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(uploaded);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // console.log(url);
          onUpload(url);
        });
      }
    );
  };

  return (
    <div className="file-input">
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          setFile(inputRef.current.files[0]);
          if (checkFileSize()) {
            if (type === "image") onChange(e);
            else onChange(inputRef.current.files[0].name);
          } else {
            e.target.value = null;
          }
        }}
        className="input"
        {...rest}
      />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="select-file-btn"
      >
        {label}
      </button>
      {file !== null && !progressShow && typeof file !== "string" && (
        <button onClick={handleUpload} className="upload-file-btn ms-3">
          Upload
        </button>
      )}
      {progressShow && progress < 100 && (
        <div className="progress_container">
          {/* <div>{progress}%</div> */}
          <div className="ms-3">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textColor: "white",
                pathColor: "green",
                backgroundColor: "white",
                strokeLinecap: "round",
                trailColor: "white",
              })}
            />
          </div>
        </div>
      )}
      {progress === 100 && (
        <div className="progress_container">
          <img src={check} alt="check circle" className="check_img" />
        </div>
      )}
    </div>
  );
};

export default FileInput;
