import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./screens/Game/Game";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Game />}>
          <Route index element={<Game />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


