import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import * as React from "react";
import PersistentDrawer from '../components/persistentDrawer'
import Profile from "./Profile";

import { Link, NavLink, Outlet } from "react-router-dom";


const DashBoard = () => {
  
 
  return (
    <>
      <PersistentDrawer>
      <Outlet/>
      </PersistentDrawer>
    </>
  );
};

export default DashBoard;
