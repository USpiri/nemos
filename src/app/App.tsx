import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { ConfigModal } from "../components/modal/config/ConfigModal";
import { Outlet } from "react-router";
import { Updater } from "@/components/updater/Updater";

function App() {
  return (
    <>
      <main className="grid h-dvh grid-cols-[auto_1fr] print:block">
        <Sidebar />
        <div className="flex flex-col overflow-auto print:overflow-visible">
          <Topbar />
          <Outlet />
        </div>
      </main>
      <Updater />
      <ConfigModal />
    </>
  );
}

export default App;
