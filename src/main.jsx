import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

const STORAGE_VERSION = "3";
const currentVersion = localStorage.getItem("storage_version");
if (currentVersion !== STORAGE_VERSION) {
  localStorage.clear();
  localStorage.setItem("storage_version", STORAGE_VERSION);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
