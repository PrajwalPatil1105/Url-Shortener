import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Register/SignUp";
import MainPage from "./Components/Dashboard/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
