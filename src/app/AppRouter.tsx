import { Navigate, Route, Routes } from "react-router";
import App from "./App";
import { Workspace } from "./workspace/Workspace";
import { NoFile } from "./no-file/NoFile";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route path="file/*" element={<Workspace />} />
        <Route path="no-file" element={<NoFile />} />
        <Route path="*" element={<Navigate to="no-file" />} />
      </Route>
    </Routes>
  );
};
