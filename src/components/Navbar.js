import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-dark text-white py-2 shadow-sm">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-auto">
            <h2 className="mb-0 d-flex align-items-center">
              {/* <i className="fa-solid fa-link-slash me-2"></i> */}
              <span className="fw-bold">
                curl<span className="text-primary">min</span>
              </span>
            </h2>
          </div>
          <div className="col">
            <p className="mb-0 text-light small d-none d-md-block">
              Share your Images easily
            </p>
          </div>
          <div className="col-auto d-none d-lg-flex">
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <Link
                    to="https://curlmin.com"
                    className="nav-link text-light"
                  >
                    URL
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="https://curlmin.com/qrcode"
                    className="nav-link text-light"
                  >
                    QRs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="https://curlmin.com/barcode"
                    className="nav-link text-light"
                  >
                    Barcodes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="https://curlmin.com/curltag"
                    className="nav-link text-light"
                  >
                    Curltags
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="https://curlmin.com/image"
                    className="nav-link text-light"
                  >
                    Images
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
