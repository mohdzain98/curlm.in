import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Share = (props) => {
  const { host } = props.prop;
  const { type, id } = useParams();
  const [endpoint, setEndpoint] = useState("");
  const [imageurl, setImageurl] = useState("");

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
        setImageurl(file);
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
        return data.error;
      }
    } catch (error) {
      console.log("Server Error Occurred");
    }
  };

  const download = () => {
    const link = document.createElement("a");
    const href = `https://curlmin.com/UserAssets/${endpoint}/${imageurl}`;
    link.href = href;
    link.download = imageurl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(href);
  };

  return (
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
  );
};

export default Share;
