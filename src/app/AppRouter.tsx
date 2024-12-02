import { Route, Routes } from "react-router";
import App from "./App";
import { Workspace } from "./workspace/Workspace";
import { NoFile } from "./no-file/NoFile";
import { RedirectToLastRoute } from "@/components/router-watcher/RouterWatcher";

export const AppRouter = () => {
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
