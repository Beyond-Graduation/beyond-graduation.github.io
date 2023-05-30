import { createContext, useContext } from "react";

const authContext = createContext();

export const isAuth = {
  isAuthenticated: false,
  userType: "",
  registering: true,
  authenticate() {
    if (localStorage.getItem("authKey") || sessionStorage.getItem("authKey")) {
      this.isAuthenticated = true;
    } else {
      this.userType = "";
    }
  },
  login(authKey, userId, userType, remember) {
    if (remember) {
      localStorage.setItem("authKey", authKey);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userType", userType);
    } else {
      sessionStorage.setItem("authKey", authKey);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userType", userType);
    }
    this.isAuthenticated = true;
  },
  logout() {
    localStorage.removeItem("authKey");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    sessionStorage.removeItem("authKey");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userType");
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
