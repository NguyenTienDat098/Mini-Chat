import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useContext } from "react";
import { ThemeContext } from "./providers/Themes";
import Notifications from "./components/Notifications";
import PageNotFound from "./pages/PageNotFound";

function App() {
  const ThemeData = useContext(ThemeContext);
  const { theme } = ThemeData;
  return (
    <div className="App relative overflow-hidden" data-theme={theme}>
      <PageNotFound />
      {/* <Notifications />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </Router> */}
    </div>
  );
}

export default App;
