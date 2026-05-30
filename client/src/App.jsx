import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";
import LoginUser from "./pages/LoginUser";
import { useSelector } from "react-redux";
const App = () => {
  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <LoginUser />} />
        <Route
          path="/register"
          element={userData ? <Home /> : <RegisterUser />}
        />
        <Route path="/login" element={userData ? <Home /> : <LoginUser />} />
      </Routes>
    </>
  );
};

export default App;
