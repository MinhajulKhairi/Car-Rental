import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage when the component mounts
    const storedUser = localStorage.getItem("user");
    const expiration = localStorage.getItem("user_expiration");

    if (storedUser && expiration) {
      const now = new Date();
      if (now.getTime() > new Date(expiration).getTime()) {
        // If the data has expired, clear it from localStorage
        logOut();
      } else {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const loginAction = async (data) => {
    if (data) {
      setUser(data);
      setToken(data.access_token);

      const now = new Date();
      const expiration = new Date(now.getTime() + 5 * 60 * 1000); // Set expiration time to 5 minutes from now

      localStorage.setItem("site", data.access_token);
      localStorage.setItem("user", JSON.stringify(data)); // Save user data to localStorage
      localStorage.setItem("user_expiration", expiration.toISOString()); // Save expiration time to localStorage

      if(data.role === 'admin'){
        navigate("/admin");
      } else {
        navigate("/list-mobil");
      }
      
    } else {
      console.log('Data login tidak valid');
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user"); // Remove user data from localStorage
    localStorage.removeItem("user_expiration"); // Remove expiration time from localStorage
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
