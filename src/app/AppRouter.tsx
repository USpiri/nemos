import { RedirectToLastRoute } from "@/components/router-watcher/RouterWatcher";
import { initialize } from "@/utils/initialize";
import { useEffect } from "react";
import { Route, Routes } from "react-router";
import App from "./App";
import { NoFile } from "./no-file/NoFile";
import { Workspace } from "./workspace/Workspace";

export const AppRouter = () => {
  useEffect(() => {
    initialize();
  }, []);

  return (
    <Routes>
      <Route element={<App />}>
        <Route path="file/*" element={<Workspace />} />
        <Route path="no-file" element={<NoFile />} />
        <Route path="*" element={<RedirectToLastRoute fallback="no-file" />} />
      </Route>
    </Routes>
  );
};
