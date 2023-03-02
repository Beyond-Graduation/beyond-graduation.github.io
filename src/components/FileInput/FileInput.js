import { useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import check from "../../assets/images/check.png";
import "./FileInput.css";
import { toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import { buildStyles } from "react-circular-progressbar";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import { Button } from "react-bootstrap";
import sampleImg from "../../assets/images/home-background.webp";

const FileInput = ({
  name,
  content,
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
  const [srcImg, setSrcImg] = useState(null);
  //save the image that used to be crop
  const [image, setImage] = useState(null);
  //change the aspect ratio of crop tool as you preferred
  const [crop, setCrop] = useState({
    unit: "px",
    width: 150,
    height: 150,
    x: 0,
    y: 0,
  });
  //save the resulted image
  const [result, setResult] = useState(null);
  const [showCropOverlay, setShowCropOverlay] = useState(false);

  const checkFileSize = () => {
    if (inputRef.current.files[0].size > 512000) {
      toast.error("Upload size must be less than 500KB");
      setFile("");
      return;
    }
    return 1;
  };

  const handleImage = async (event) => {
    setSrcImg(URL.createObjectURL(event.target.files[0]));
    console.log(event.target.files[0]);
  };

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement("canvas");
      const cropImage = document.getElementById("crop-image");
      const imageMain = new Image();
      imageMain.src = srcImg;
      const ctx = canvas.getContext("2d");

      console.log(imageMain.naturalHeight, cropImage.height);

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = imageMain.naturalWidth / cropImage.width;
      const scaleY = imageMain.naturalHeight / cropImage.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = 0;
      const centerX = imageMain.naturalWidth / 2;
      const centerY = imageMain.naturalHeight / 2;

      ctx.save();

      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.rotate(rotateRads);
      ctx.scale(1, 1);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        imageMain,
        0,
        0,
        imageMain.width,
        imageMain.height,
        0,
        0,
        imageMain.width,
        imageMain.height
      );

      ctx.save();

      const base64Image = canvas.toDataURL("image/", 1);

      if (canvas.height < 50) toast.error("Select a larger area !!");
      else {
        onChange(base64Image);
        setResult(base64Image);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpload = () => {
    setProgressShow(true);

    const fileName =
      content +
      "_" +
      new Date().getTime() +
      "_" +
      inputRef.current.files[0].name;
    const storageRef = ref(storage, `/${content}/${fileName}`);
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
          setProgress(0);
          setProgressShow(false);
          if (checkFileSize()) {
            if (type === "image") {
              // onChange(e);
              if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
                toast.error("not an image");
              else handleImage(e);
            } else onChange(inputRef.current.files[0].name);
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
      <div>
        {srcImg && (
          <div className="crop-overlay">
            <div className="crop-cnt">
              <div className="crop-head">Crop your image</div>
              <ReactCrop
                style={{ maxWidth: "50%" }}
                src={srcImg}
                onImageLoaded={setImage}
                crop={crop}
                onChange={setCrop}
                aspect={1}
                circularCrop={true}
              >
                <img
                  src={srcImg}
                  alt=""
                  id="crop-image"
                  className="image-crop"
                />
              </ReactCrop>
              <Button onClick={getCroppedImg}>crop</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;
