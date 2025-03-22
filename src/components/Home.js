import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.location.href = "https://curlmin.com";
  }, []);
  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <span className="spinner-border"></span>
      {/* <p>redirect</p> */}
    </div>
  );
};

export default Home;
