import {
  BrowserRouter as Router
} from "react-router-dom";

import './App.scss';

import AppBar from 'components/AppBar/AppBar';
import BoardBar from "components/BoardBar/BoardBar";
import BoardContent from "components/BoardContent/BoardContent";

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar/>
        <BoardBar/>
        <BoardContent/>
      </div>
    </Router>
  );
}

export default App;
