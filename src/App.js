import Game from "./component/Game";
import GameOver from "./component/GameOver";
import Settings from "./component/Settings";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
