import { Route, Routes } from "react-router-dom";
import GamePage from "./pages/game";

import PlayerPage from "./pages/player";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/webcam" element={<GamePage webcam />} />
      <Route path="player-1" element={<PlayerPage user="player1" />} />
      <Route path="player-2" element={<PlayerPage user="player2" />} />
    </Routes>
  );
}

export default App;
