import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Login from "./components/Login";
import DashBoard from "./Pages/DashBoard";
import Profile from "./Pages/Profile";
import AdminData from "./Pages/AdminData";
import PersistentDrawer from "./components/persistentDrawer";
const Router = () => {
  const [cookieValue, setCookieValue] = useState("");

  useEffect(() => {
    if (document) {
      setCookieValue(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)userData\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )
      );
      console.log("cookieValue", cookieValue);
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<PersistentDrawer />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/adminData" element={<AdminData />} />
          </Route> */}
          <Route path="/" element={<Login />} />
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/adminData" element={<AdminData />} />
          <Route path="*" element={<h1>error page</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
