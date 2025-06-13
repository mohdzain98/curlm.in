import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NotifyModal from "./NotifyModal";
import "./images.css";

const Image = (props) => {
  const { host } = props.prop;
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageurl, setImageurl] = useState("");
  const [file_key, setFileKey] = useState("");
  const [data, setData] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const refNot = useRef(null);
  // eslint-disable-next-line
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const currentDate = new Date();

  const extractUidAndExt = (fileKey) => {
    if (!fileKey.startsWith("images/")) return null;

    const filename = fileKey.split("/")[1]; // e.g., "nvm6vA.jpeg"
    const dotIndex = filename.lastIndexOf(".");

    if (dotIndex === -1) return null;

    const uid = filename.substring(0, dotIndex); // "nvm6vA"
    const ext = filename.substring(dotIndex + 1); // "jpeg"

    return { uid, ext };
  };
  const convertToUTC = (mysqlDate) => {
    if (!mysqlDate) return null;
    let formattedDate = mysqlDate.replace(" ", "T");
    let utcDate = new Date(formattedDate);
    return utcDate;
  };

  const formatExpiry = (date) => {
    const dates = new Date(date);
    const manual = dates.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
    return manual;
  };

  const formatCurrent = (date) => {
    const dates = new Date(date);
    const manual = dates.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return manual;
  };

  const handleUnlock = () => {
    if (enteredPassword === password) {
      setUnlocked(true);
      setShowPasswordModal(false);
      setEnteredPassword("");
    } else {
      setMsg("Incorrect password");
    }
  };

  const fetchImage = async () => {
    try {
      const response = await fetch(`${host}/img/${id}`);
      if (!response.ok) {
        setMsg("Image Not Found");
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setMsg("Image Not Found");
        refNot.current.click();
        return;
      }

      const imData = data.imData;
      setData(imData);
      const expiryDate = convertToUTC(imData.expires_at);
      console.log("download", data.download);

      // Case 1: Expired and not permanent
      if (
        !imData.isPermanent &&
        formatExpiry(expiryDate) <= formatCurrent(currentDate)
      ) {
        setMsg(`Your URL has expired at ${formatExpiry(expiryDate)}`);
        refNot.current.click();
        return;
      }
      if (!imData.pass) {
        setUnlocked(true);
      }
      // Case 2: Permanent and has password → Lock it
      if (imData.isPermanent && imData.pass) {
        setImageurl(data.url);
        setPassword(imData.passval);
        setFileKey(imData.file_key);
        return;
      }

      // Case 3: Permanent and no password → Show directly
      if (imData.isPermanent && !imData.pass) {
        console.log("Permanent URL with no password");
        setImageurl(data.url);
        setFileKey(imData.file_key);
        return;
      }

      // Case 4: Temporary but not expired and maybe has password
      setImageurl(data.url);
      setFileKey(imData.file_key);
      if (imData.pass) {
        setPassword(imData.passval);
      }
    } catch (error) {
      console.error("error:", error);
      setMsg("There is some Error Accessing Server");
    }
  };

  useEffect(() => {
    document.title = "Curlm.in | Image";
    if (!imageurl) {
      async function getImage() {
        await fetchImage();
        setLoading(false);
      }
      getImage();
    }
    // const handleContextMenu = (e) => e.preventDefault();
    // document.addEventListener("contextmenu", handleContextMenu);
    // return () => document.removeEventListener("contextmenu", handleContextMenu);
    // eslint-disable-next-line
  }, [imageurl]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }

  const download = async () => {
    const result = extractUidAndExt(file_key);
    console.log("inside download", result);
    if (result === null) {
      setMsg("Invalid file key format");
      return;
    }
    try {
      const response = await fetch(
        `${host}/download?uid=${result.uid}&ext=${result.ext}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();

      // Create a temporary URL and trigger the download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", file_key);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      setMsg("Failed to download image.");
    }
  };

  return (
    <div className="d-flex flex-column">
      <Navbar />
      {/* Main Content */}
      <main className="flex-grow-1">
        <div className="container-fluid py-4">
          {imageurl ? (
            <div className="d-flex justify-content-center align-items-center flex-column gap-4 py-4 mx-3">
              <h3 className="text-center mb-1">
                <i className="fa-solid fa-qr-code me-2"></i>
                Your Image
              </h3>

              <div className="card border-0 shadow-lg rounded-4 p-3 bg-white position-relative">
                {/* Lock Overlay */}
                {!unlocked && (
                  <div className="image-overlay">
                    <button
                      className="btn btn-dark btn-lg rounded-circle"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <i className="fa-solid fa-lock"></i>
                    </button>
                  </div>
                )}

                <div className="card-body p-1 text-center">
                  <img
                    src={imageurl}
                    alt="share-easy"
                    className={`img-fluid rounded-3 ${
                      !unlocked ? "blur-image" : ""
                    }`}
                    style={{
                      objectFit: "contain",
                      maxHeight: `${isTabletOrMobile ? "150px" : "300px"}`,
                      minHeight: "200px",
                    }}
                  />
                </div>

                <div className="card-footer bg-white border-0 text-center pt-3 pb-2">
                  {data.download && (
                    <button
                      className="btn btn-primary btn-lg px-4 shadow-sm rounded-pill fw-bold"
                      onClick={download}
                      disabled={!unlocked}
                    >
                      <i className="fa-solid fa-download me-2"></i>
                      Download
                    </button>
                  )}
                  <div className="mt-3 text-muted small">
                    Sharing Image made easy
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center py-5 flex-column gap-3">
              <div className="text-center px-4">
                <img
                  src={require("../assets/notfound.webp")}
                  alt="not found"
                  className="img-fluid"
                  style={{ maxHeight: "320px", opacity: "0.9" }}
                />
                <h1 className="fw-bold text-danger mt-4">{msg}</h1>
                <Link
                  to="https://curlmin.com/image"
                  className="btn btn-outline-primary mt-3"
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Upload a new Image
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      {showPasswordModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                />
                {msg && (
                  <div
                    className={`alert alert-danger my-2 alert-dismissible fade show`}
                    role="alert"
                  >
                    {msg}
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                      onClick={() => setMsg("")}
                    ></button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUnlock}>
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        class="btn btn-primary invisible"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop2"
        ref={refNot}
      >
        Launch static modal
      </button>
      <NotifyModal prop={{ msg }} />
      <Footer />
    </div>
  );
};

export default Image;
