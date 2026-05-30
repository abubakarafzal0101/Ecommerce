import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../redux/slices/userSlice";
const Home = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(null));
    dispatch(setUserData(null));
  };
  return (
    <div className="cursor-pointer" onClick={handleLogout}>
      Logout
    </div>
  );
};

export default Home;
