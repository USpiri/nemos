import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";
import { Workspace } from "./components/workspace/Workspace";
import { ConfigModal } from "./components/modal/config/ConfigModal";

function App() {
  return (
    <>
      <main className="grid h-dvh grid-cols-[auto_1fr]">
        <Sidebar />
        <div className="flex flex-col overflow-auto print:overflow-visible">
          <Topbar />
          <div className="flex-1 overflow-auto px-8 pt-32">
            <Workspace />
          </div>
        </div>
      </main>
      <ConfigModal />
    </>
  );
}

export default App;
