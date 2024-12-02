import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppRouter } from "./app/AppRouter.tsx";
import { RouteWatcher } from "./components/router-watcher/RouterWatcher";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteWatcher />
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
);
