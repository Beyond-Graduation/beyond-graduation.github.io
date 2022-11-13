import React, { useState } from "react";
import "./FileViewOverlay.css";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { HiDownload } from "react-icons/hi";
import { useRef } from "react";
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function FileViewOverlay({ url, name, showOverlay, closeOverlay }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const docRef = useRef();
  const overlayCntRef = useRef();
  const overlayRef = useRef();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadResume = () => {
    fetch(url)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          `${name.firstName}_${name.lastName}_Resume.pdf`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        return Promise.reject({ Error: "Something Went Wrong", err });
      });
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        overlayCntRef.current &&
        !overlayCntRef.current.contains(e.target) &&
        overlayRef.current.contains(e.target)
      ) {
        closeOverlay();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className={`file-overlay ${showOverlay ? "" : "hide-overlay"}`}
      ref={overlayRef}
    >
      <AiOutlineClose className="close-overlay" onClick={closeOverlay} />
      <div className="file-overlay-cnt" ref={overlayCntRef}>
        <div className="file-download-btn">
          <div className="file-download-btn-inner">
            <HiDownload onClick={downloadResume} />
            <span>Download</span>
          </div>
        </div>
        <div className="overlay-top mb-4 ps-5 pe-5 d-flex align-items-center justify-content-between">
          <div>
            {name.firstName} {name.lastName}'s Resume
          </div>
          <span>
            {pageNumber} {pageNumber > 1 ? "pages" : "page"}
          </span>
        </div>
        <div className="file-overlay-inner">
          <Document
            file={{ url: url }}
            onLoadSuccess={onDocumentLoadSuccess}
            ref={docRef}
            loading="Loading Resume ..."
          >
            {[...Array(numPages).keys()].map((i) => {
              return (
                <Page
                  pageNumber={i+1}
                  scale={1.4}
                  onRenderSuccess={() => {
                    const links =
                      document.querySelectorAll(".react-pdf__Page a");
                    links.forEach((link) => {
                      link.setAttribute("target", "_blank");
                    });
                  }}
                />
              );
            })}
          </Document>
        </div>
      </div>
    </div>
  );
}

export default FileViewOverlay;
