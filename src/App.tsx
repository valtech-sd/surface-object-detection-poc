import { Route, Routes } from "react-router-dom";
import GamePage from "./pages/game";

import "./App.css";
import PlayerPage from "./pages/player";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="player-1" element={<PlayerPage user="player1" />} />
    </Routes>
  );
}

export default App;
