import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";
import { Editor } from "./components/editor/Editor";

function App() {
  return (
    <main className="grid h-dvh grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto px-8 pb-[30vh] pt-32">
          <div className="editor-wrapper mx-auto w-full max-w-2xl">
            <Editor />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
