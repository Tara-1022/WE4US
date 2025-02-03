import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "react-app/src/Index";
import Recent from "./Recent"; // Make sure you have a Recent component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/recent" element={<Recent />} />
      </Routes>
    </Router>
  );
};

export default App;
