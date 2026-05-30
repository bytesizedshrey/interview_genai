import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";
// useEffect

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setuser, loading, setloading } = context;

  const handleLogin = async ({ email, password }) => {
    setloading(true);
    try {
      const data = await login({ email, password });
      setuser(data.user);
    } catch (error) {
        //not done yet
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setloading(true);
    const data = await register({ username, email, password });

    setuser(data.user);
    setloading(false);
  };

  const handleLogout = async () => {
    setloading(true);
    const data = await logout();
    setuser(null);
    setloading(false);
  };

  useEffect(()=>{
    const getAndSetUser =  async()=>{
        const data = await getMe()
        setuser(data.user)
        setloading(false)  
    }
    getAndSetUser()
},[])

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
