import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./main-app.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
