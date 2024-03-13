import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageDetail from "./pages/PageDetail";

export default function App() {
  return (
    <div className="App bg-slate-600">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pageDetail/:gameId" element={<PageDetail />} />
      </Routes>
    </div>
  );
}
