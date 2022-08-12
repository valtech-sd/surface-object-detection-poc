import { Route, Routes } from "react-router-dom";
import GamePage from "./pages/game";

import PlayerPage from "./pages/player";

import { HORIZONTAL_PADDING, VERTICAL_PADDING } from "./utils/config";

import "./App.css";

document.documentElement.style.setProperty(
  "--padding-vertical",
  `${VERTICAL_PADDING}px`
);

document.documentElement.style.setProperty(
  "--padding-horizontal",
  `${HORIZONTAL_PADDING}px`
);

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
