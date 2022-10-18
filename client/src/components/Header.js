import React,{useState, useEffect} from "react";
import PersistentDrawer from "./persistentDrawer";
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import DashBoard from "../Pages/DashBoard";

import Profile from "../Pages/Profile";
import AdminData from "../Pages/AdminData";

const Header = () => {
  const [cookieValue, setCookieValue] = useState('');

  useEffect(() => {
    if (document) {
      setCookieValue(document.cookie.replace(
        /(?:(?:^|.*;\s*)userData\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      ));
      console.log("cookieValue", cookieValue);
    }
  },[]);

 
  return (
    <>
      <PersistentDrawer>
        <Switch>
          <Route exact path="/" element={cookieValue == '' ? <Login/> : <DashBoard/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route exact path="/adminData" element={<AdminData/>} />
        </Switch>
      </PersistentDrawer>
    </>
  );
};

export default Header;
