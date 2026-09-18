import React from "react";
import ReactDOM from "react-dom/client";
import { invoke } from "@tauri-apps/api/core";
import App from "./App";
import "./index.css";

// Notify Rust backend that frontend has started loading
invoke("log_frontend", { msg: "main.tsx script loaded" }).catch(() => {});

window.addEventListener("error", (event) => {
  invoke("log_frontend", {
    msg: `JS ERROR: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
  }).catch(() => {});
});

window.addEventListener("unhandledrejection", (event) => {
  invoke("log_frontend", {
    msg: `PROMISE REJECTION: ${String(event.reason)}`,
  }).catch(() => {});
});

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  invoke("log_frontend", { msg: "React.createRoot executed successfully" }).catch(() => {});
} else {
  invoke("log_frontend", { msg: "FATAL: #root element not found in index.html" }).catch(() => {});
}

