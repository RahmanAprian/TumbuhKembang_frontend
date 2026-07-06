import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (form) => {
    const { data } = await api.post('/register', form);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); setToken(null);
  };

  return <Ctx.Provider value={{ user, token, login, register, logout }}>{children}</Ctx.Provider>;
}
