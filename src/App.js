import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Signup from "./Componeent/Auth/Signup";
import SignupState from "./Componeent/Auth/context/SignupState";
import Dummy from "./Componeent/Auth/context/Dummy";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="*"
            element={
              <SignupState>
                <Signup />
              </SignupState>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
