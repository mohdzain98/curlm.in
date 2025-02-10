import React from "react";
import { Link } from "react-router-dom";

const NotifyModal = (props) => {
  const { msg } = props.prop;

  const handleClose = (e) => {
    e.preventDefault();
    // window.location.href = "https://curlmin.com";
  };

  return (
    <div
      class="modal"
      id="staticBackdrop2"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Hi! there</h5>
          </div>
          <div class="modal-body">
            <p>
              {msg}
              <br />
              <Link to={"https://curlmin.com"}>Short new URL Now</Link>
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotifyModal;
