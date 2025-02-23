import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Share = (props) => {
  const { host } = props.prop;
  const { type, id } = useParams();
  const [endpoint, setEndpoint] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="container p-3">
      {imageurl ? (
        <div className="d-flex justify-content-center align-items-center flex-column gap-3 vh-100">
          <div className="shadow-sm border">
            <img
              src={`https://curlmin.com/UserAssets/${endpoint}/${imageurl}`}
              alt={endpoint}
            />
          </div>
          <div>
            <button className="btn btn-primary shadow-sm" onClick={download}>
              <i className="fa-solid fa-download me-2"></i>Download
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
          <img
            src={require("../assets/notfound.webp")}
            alt="not found"
            height={350}
          />
          <h1 className="fw-bold text-secondary">{msg}</h1>
        </div>
      )}
    </div>
  );
};

export default Share;
