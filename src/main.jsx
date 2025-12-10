import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root";
import "./styles/login-page.scss";
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
  <Root />
  //</React.StrictMode>
);
