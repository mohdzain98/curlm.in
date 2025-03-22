import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Share = (props) => {
  const { host } = props.prop;
  const { type, id } = useParams();
  const [endpoint, setEndpoint] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    document.title = "Curlm.in | Share Images";
    if (type === "qr") {
      setEndpoint("qrcodes");
    } else if (type === "bc") {
      setEndpoint("barcodes");
    } else {
      setEndpoint("curltags");
    }
    if (!imageurl) {
      async function getFileName() {
        const file = await fetchFile();
        if (file) {
          setImageurl(file);
        }
        setLoading(false);
      }
      getFileName();
    }
    // eslint-disable-next-line
  }, [type, imageurl]);

  const fetchFile = async () => {
    try {
      const response = await fetch(`${host}/${type}/${id}`);
      const data = await response.json();
      if (response.ok) {
        return data.filename;
      } else {
        setMsg(data.error);
      }
    } catch (error) {
      setMsg("There is some Error Accessing Server");
    }
  };

  const download = async () => {
    try {
      const response = await fetch(
        `https://curlmin.com/UserAssets/${endpoint}/${imageurl}`
      );
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", imageurl);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setMsg("Download failed");
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <span className="spinner-border"></span>
      </div>
    );
  }

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
                Your{" "}
                {endpoint.charAt(0).toUpperCase() +
                  endpoint.slice(1, endpoint.length - 1)}
              </h3>
              <div className="card border-0 shadow-lg rounded-4 p-3 bg-white">
                <div className="card-body p-1 text-center">
                  <img
                    src={`https://curlmin.com/UserAssets/${endpoint}/${imageurl}`}
                    alt={endpoint}
                    className="img-fluid rounded-3"
                    style={{
                      objectFit: "contain",
                      maxHeight: `${isTabletOrMobile ? "150px" : "300px"}`,
                      minHeight: `${type === "qr" ? "200px" : ""}`,
                    }}
                  />
                </div>
                <div className="card-footer bg-white border-0 text-center pt-3 pb-2">
                  <button
                    className="btn btn-primary btn-lg px-4 shadow-sm rounded-pill fw-bold"
                    onClick={download}
                  >
                    <i className="fa-solid fa-download me-2"></i>
                    Download
                  </button>
                  <div className="mt-3 text-muted small">
                    {type === "bc"
                      ? "Scan with our Barcode Scanner to access your shortened URL"
                      : "Scan with any QR reader to access your shortened URL"}
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
                <h1 className="fw-bold text-secondary mt-4">{msg}</h1>
                <Link
                  to="https://curlmin.com"
                  className="btn btn-outline-primary mt-3"
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Create a new shortened URL
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Share;
