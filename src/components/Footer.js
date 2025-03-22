import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-auto border-top fixed-bottom">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="fw-bold">
              curl<span className="text-primary">min</span>
            </span>
            <span className="text-muted ms-2">
              &copy; {new Date().getFullYear()} | Create Short and Secure Links
            </span>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0" style={{ fontSize: "15px" }}>
              <li className="list-inline-item">
                <Link
                  to="https://curlmin.com/privacy-policy"
                  className="text-decoration-none text-muted"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="list-inline-item mx-3">
                <Link
                  to="https://curlmin.com/terms"
                  className="text-decoration-none text-muted"
                >
                  Terms of Service
                </Link>
              </li>
              <li className="list-inline-item me-2">
                <Link
                  to="https://curlmin.com/contactus"
                  className="text-decoration-none text-muted"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
