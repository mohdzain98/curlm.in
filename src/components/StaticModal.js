import React, { useRef, useState } from "react";

const StaticModal = (props) => {
  const { password, url } = props.prop;
  const [pass, setPass] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", msg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const refClose = useRef(null);

  const HandleSubmit = () => {
    setIsLoading(true);
    console.log(pass, password);
    if (pass === password) {
      setAlert({ show: true, type: "success", msg: "password matched" });
      refClose.current.click();
      window.location.href = url;
    } else {
      setAlert({
        show: true,
        type: "danger",
        msg: "Password Does not Matched, try again",
      });
    }
    setIsLoading(false);
  };
  return (
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Link is Pasword Protected
            </h1>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="Enter Pasword Here"
                  disabled={isLoading}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                {alert.show ? (
                  <div class={`alert alert-${alert.type} my-2`} role="alert">
                    {alert.msg}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref={refClose}
            >
              Close
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              onClick={HandleSubmit}
            >
              {isLoading ? (
                <span>
                  Checking...
                  <span className="spinner-border spinner-border-sm"></span>
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticModal;
