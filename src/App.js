import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Home from "./components/Home";
import Main from "./components/Main";

function App() {
  const host = process.env.REACT_APP_HOST;

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route
            exact
            path="/:alias"
            element={<Main prop={{ host }} />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
