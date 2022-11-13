import { createContext, useContext } from "react";

const authContext = createContext();

export const isAuth = {
  isAuthenticated: false,
  userType: "",
  registering: true,
  authenticate() {
    if (localStorage.getItem("authKey")) {
      this.isAuthenticated = true;
    } else {
      this.userType = "";
    }
  },
  login(authKey, userId, userType) {
    localStorage.setItem("authKey", authKey);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userType", userType);
    this.isAuthenticated = true;
  },
  logout() {
    localStorage.removeItem("authKey");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    this.isAuthenticated = false;
  },
  checkAuth() {
    this.authenticate();
    return this.isAuthenticated;
  },
};

export const AuthProvider = ({ children }) => {
  return <authContext.Provider value={isAuth}>{children}</authContext.Provider>;
};

export default function AuthConsumer() {
  return useContext(authContext);
}
