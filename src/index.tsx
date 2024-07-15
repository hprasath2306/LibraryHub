import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const PUBLISHABLE_KEY =
  "pk_test_bGFyZ2UtZ3J1Yndvcm0tNTQuY2xlcmsuYWNjb3VudHMuZGV2JA";

root.render(
  <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </BrowserRouter>
);
