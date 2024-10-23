import { Sidebar } from "@/components/sidebar/Sidebar";
function App() {
  return (
    <>
      <main className="grid h-screen grid-cols-[auto_1fr]">
        <Sidebar />
        <div>App content</div>
      </main>
    </>
  );
}

export default App;
