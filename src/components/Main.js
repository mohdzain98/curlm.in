import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import StaticModal from "./StaticModal";
import NotifyModal from "./NotifyModal";
import Navbar from "./Navbar";

const Main = (props) => {
  const { host } = props.prop;
  const { alias } = useParams();
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const currentDate = new Date();
  const ref = useRef(null);
  const refNot = useRef(null);

  const getService = (alias) => {
    if (alias.startsWith("qr")) {
      return "qrcode";
    } else if (alias.startsWith("bc")) {
      return "barcode";
    } else if (alias.startsWith("st")) {
      return "curltag";
    } else {
      return "url";
    }
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

  const fetchLongUrl = async (endpoint, alias) => {
    try {
      const response = await fetch(`${host}/${endpoint}/${alias}`);
      if (response.status === 500) {
        setMsg("Internel Server Error Occurred");
        refNot.current.click();
      } else {
        const data = await response.json();
        if (data.success) {
          if (endpoint === "url") {
            // const expiryDate = new Date(data.urlData.expiryDate);
            let expiryDate = convertToUTC(data.urlData.expiryDate);
            if (data.urlData.isPermanent) {
              window.location.href = data.longUrl;
            } else if (formatExpiry(expiryDate) <= formatCurrent(currentDate)) {
              setMsg(
                `Your URL has been Expired at ${formatExpiry(expiryDate)}`
              );
              refNot.current.click();
              return;
            } else if (data.urlData.pass) {
              setUrl(data.urlData.longUrl);
              setPassword(data.urlData.passval);
              ref.current.click();
            } else {
              window.location.href = data.longUrl;
            }
          } else {
            window.location.href = data.longUrl;
          }
        } else {
          setNotFound(true);
          document.title = "curlmin | Not Found";
        }
      }
    } catch (error) {
      setMsg("Error fetching URL:", error);
      refNot.current.click();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "curlmin | redirect";
    const service = getService(alias);
    switch (service) {
      case "url":
        fetchLongUrl("url", alias);
        break;
      case "qrcode":
        fetchLongUrl("qrcode", alias);
        break;
      case "barcode":
        fetchLongUrl("barcode", alias);
        break;
      case "curltag":
        fetchLongUrl("curltag", alias);
        break;
      default:
        setNotFound(true);
        document.title = "curlmin | Not Found";
        break;
    }
    // eslint-disable-next-line
  }, [alias]);

  if (loading) {
    return (
      <div>
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="vh-100">
      <Navbar />
      <div className="container px-4 mt-1 mb-2">
        {/* <div className="d-flex justify-content-center align-item-center">
          <span className="spinner-border"></span>
        </div> */}
        {notFound && (
          <div>
            <div className="d-flex justify-content-center align-items-center flex-column mt-5">
              <img
                src={require("../assets/notfound.webp")}
                alt="not found"
                style={{ maxHeight: "300px" }}
                className="img-fluid"
              />
              <h1 className="fw-bold text-secondary">Not Found</h1>
              <h4 className="text-center">
                What you are Looking , does not found on curlmin
              </h4>
              <p
                className="lead text-muted text-center"
                style={{ fontSize: "19px" }}
              >
                Either you have clicked on the wrong link, or your link has
                expired
              </p>
              <div className="d-flex flex-row gap-2 mt-3">
                <Link to="https://curlmin.com/login">
                  <button className="btn btn-outline-secondary ">Login</button>
                </Link>
                <Link to="https://curlmin.com/signup">
                  <button className="btn btn-outline-secondary">Signup</button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          class="btn btn-primary invisible"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          ref={ref}
        >
          Launch static backdrop modal
        </button>
        <StaticModal prop={{ password, url }} />
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
      </div>
    </div>
  );
};

export default Main;
