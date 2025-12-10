import { Button } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/file-not-found.scss";
// images
import imgNoInternet from "../../assets/NoInternet-Unbackground.png";

const NoInternetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || "/";
  const message = location.state?.message || "No Internet Connection";

  return (
    <>
      <div className="error-container">
        <img
          className="error-code mb-2 text-lg font-bold"
          width={"10%"}
          src={imgNoInternet}
        />
        <h1 className="message">{message}</h1>
        <div>
          <Button
            onClick={() => navigate(returnUrl)}
            className="home-btn fw-bold"
            size="large"
            type="primary"
          >
            GO BACK
          </Button>
        </div>
      </div>
    </>
  );
};

export default NoInternetPage;
