import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Home from "./components/Home";
import Main from "./components/Main";
import Share from "./components/Share";
import Image from "./components/Image";

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
          <Route
            exact
            path="/:type/:id"
            element={<Share prop={{ host }} />}
          ></Route>
          <Route
            exact
            path="/img/:id"
            element={<Image prop={{ host }} />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
