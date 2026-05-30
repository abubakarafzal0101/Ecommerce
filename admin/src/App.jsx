import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ListProducts from "./pages/ListProducts";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import { useSelector } from "react-redux";

const App = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Home /> : <Login />}>
          <Route path="add-product" element={<AddProduct />} />
          <Route path="list-products" element={<ListProducts />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
