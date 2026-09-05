import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RepositoryWorkspace from "./pages/RepositoryWorkspace";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/repositories/:id"
          element={<RepositoryWorkspace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;