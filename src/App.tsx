import { Route, Routes } from "react-router-dom";
import GamePage from "./pages/game";

import "./App.css";
import PlayerPage from "./pages/player";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="player-1" element={<PlayerPage user="player1" />} />
      <Route path="player-2" element={<PlayerPage user="player2" />} />
    </Routes>
  );
}

export default App;
