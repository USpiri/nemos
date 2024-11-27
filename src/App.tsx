import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";
import { Editor } from "./components/editor/Editor";
import { useFileStore } from "./store/file/file.store";
import { write } from "./utils/fs";

function App() {
  const content = useFileStore((store) => store.activeFile?.content);
  const path = useFileStore((store) => store.activeFile?.path);

  return (
    <main className="grid h-dvh grid-cols-[auto_1fr] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto px-8 pb-[30vh] pt-32">
          <div className="editor-wrapper mx-auto w-full max-w-2xl">
            <Editor
              content={content}
              onChange={async (editor) => {
                if (!path) return;
                await write(path, {
                  content: editor.getHTML(),
                });
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
