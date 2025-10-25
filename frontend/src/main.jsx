import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

console.log("✅ main.jsx loaded");

// Make sure this matches the id in index.html
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Root element with id="root" not found in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
