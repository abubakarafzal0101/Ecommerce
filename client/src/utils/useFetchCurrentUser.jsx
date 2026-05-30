import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";

const useFetchCurrentUser = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.success) {
          dispatch(setUserData(response.data.user));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [serverUrl, token]);
};

export default useFetchCurrentUser;
