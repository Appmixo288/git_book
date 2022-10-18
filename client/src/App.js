import React,{useState, useEffect} from "react";
import "./App.css";
import Login from "./components/Login";
import DashBoard from "./Pages/DashBoard";

import Profile from "./Pages/Profile";
import AdminData from "./Pages/AdminData";

const App=()=>{

  const [cookieValue, setCookieValue] = useState('');

  // useEffect(() => {
  //   if (document) {
  //     setCookieValue(document.cookie.replace(
  //       /(?:(?:^|.*;\s*)userData\s*\=\s*([^;]*).*$)|^.*$/,
  //       "$1"
  //     ));
  //     console.log("cookieValue", cookieValue);
  //   }
  // },[]);

  return(
    <>
    <h1>dfuyhbg</h1>
    </>
  )
}
export default App;



