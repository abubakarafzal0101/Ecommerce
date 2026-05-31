import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";
import LoginUser from "./pages/LoginUser";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import useFetchCurrentUser from "./utils/useFetchCurrentUser";
import Cart from "./pages/Cart";
import SingleProduct from "./components/SingleProduct";
const App = () => {
  useFetchCurrentUser();
  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={userData ? <Home /> : <LoginUser />} />
        <Route
          path="/register"
          element={userData ? <Home /> : <RegisterUser />}
        />
        <Route path="/login" element={userData ? <Home /> : <LoginUser />} />
        <Route path="/cart" element={userData ? <Cart /> : <LoginUser />} />
        <Route
          path="/product/:productId"
          element={userData ? <SingleProduct /> : <LoginUser />}
        />
      </Routes>
    </>
  );
};

export default App;
