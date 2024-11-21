import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";
import { Editor } from "./components/editor/Editor";

function App() {
  return (
    <main className="grid h-dvh grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto px-2 py-1">
          <Editor />
        </div>
      </div>
    </main>
  );
}

export default App;
