import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "./components/topbar/Topbar";

function App() {
  return (
    <main className="grid h-screen grid-cols-[auto_1fr]">
      <Sidebar />
      <div>
        <Topbar />
        <div>Editor</div>
      </div>
    </main>
  );
}

export default App;
