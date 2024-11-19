import { Sidebar } from "@/components/sidebar/Sidebar";

function App() {
  return (
    <main className="grid h-screen grid-cols-[auto_1fr]">
      <Sidebar />
      <div>
        <div className="flex h-11 items-center justify-center border-b border-neutral-800 print:hidden">
          File title and buttons
        </div>
        <div>Editor</div>
      </div>
    </main>
  );
}

export default App;
