import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  return (
    <div style={{ margin: "10%", padding: "20px", textAlign: "center" }}>
      <h1>Welcome to Kristagram Admin</h1>
      <br />
      <br />

      <Button
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={() => {
          if (window.location.hostname === "localhost") {
            window.open("http://localhost:4000/auth/google", "_self");
          } else {
            window.open(window.location.origin + "/auth/google", "_self");
          }
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
};

export default Login;
