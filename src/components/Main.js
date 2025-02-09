import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import StaticModal from "./StaticModal";
import NotifyModal from "./NotifyModal";

const Main = (props) => {
  const { host } = props.prop;
  const { alias } = useParams();
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [msg, setMsg] = useState("");
  const currentDate = new Date();
  const ref = useRef(null);
  const refNot = useRef(null);

  const getService = (alias) => {
    if (alias.startsWith("qr")) {
      return "qr";
    } else if (alias.startsWith("bc")) {
      return "barcode";
    } else if (alias.startsWith("st")) {
      return "curltag";
    } else {
      return "url";
    }
  };

  const fetchLongUrl = async (endpoint, alias) => {
    try {
      const response = await fetch(`${host}/${endpoint}/${alias}`);
      if (response.status === 500) {
        console.log("Internel Server Error Occurred");
      } else {
        const data = await response.json();
        if (data.success) {
          const expiryDate = new Date(data.urlData.expiryDate);
          if (expiryDate < currentDate) {
            setMsg(`Your URL has been Expired at ${expiryDate}`);
            refNot.current.click();
            return;
          }
          if (endpoint === "url" && data.urlData.pass) {
            setUrl(data.urlData.longUrl);
            setPassword(data.urlData.passval);
            ref.current.click();
          } else {
            window.location.href = data.longUrl;
          }
        } else {
          console.log(data.msg);
          setNotFound(true);
          document.title = "curlmin | Not Found";
        }
      }
    } catch (error) {
      console.error("Error fetching URL:", error);
    }
  };

  useEffect(() => {
    document.title = "curlmin | redirect";
    const service = getService(alias);
    console.log(service);
    switch (service) {
      case "url":
        fetchLongUrl("url", alias);
        break;
      case "qr":
        fetchLongUrl("qr", alias);
        break;
      case "Barcode":
        fetchLongUrl("barcode", alias);
        break;
      case "Curltag":
        fetchLongUrl("curltag", alias);
        break;
      default:
        console.log("Code is Wrong");
        break;
    }
    // eslint-disable-next-line
  }, [alias]);

  return (
    <>
      <div className="container px-4 mt-1 mb-2">
        <div className="d-flex justify-content-center align-item-center">
          <span className="sinner-border"></span>
        </div>
        {notFound && (
          <div>
            <nav class="navbar navbar-expand-lg bg-default">
              <div class="container-fluid">
                <a
                  className="navbar-brand text-primary fw-bold"
                  href="https://curlmin.com"
                >
                  curlmin
                </a>
                <div className="float-end d-flex flex-row flex-wrap">
                  <a
                    href="https://curlmin.com/login"
                    className="btn btn-default text-danger"
                  >
                    Login
                  </a>
                  <a
                    href="https://curlmin.com/signup"
                    className="btn btn-default text-success"
                  >
                    Signup
                  </a>
                </div>
              </div>
            </nav>
            <div className="d-flex justify-content-center align-items-center flex-column">
              <img
                src={require("../assets/notfound.webp")}
                alt="not found"
                height={350}
              />
              <h1 className="fw-bold text-secondary">Not Found</h1>
              <h4>What you are Looking , does not found on curlmin</h4>
              <p className="lead text-muted">
                Either you have clicked on the wrong link, or your link has
                expired
              </p>
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
    </>
  );
};

export default Main;
