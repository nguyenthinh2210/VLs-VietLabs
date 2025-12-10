import { Button } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/file-not-found.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || "/";
  const message = location.state?.message || "Not Found";

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="error-container">
          <h1 className="error-code mb-2 text-lg font-bold">404</h1>
          <h1 className="message mb-2 text-lg font-bold">{message}</h1>
          <Button
            className="home-btn fw-bold"
            size="large"
            type="primary"
            onClick={() => navigate(returnUrl)}
          >
            GO BACK
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
