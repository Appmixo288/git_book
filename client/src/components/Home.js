import React from "react";

const Home = () => {
  return (
    <div
      className="card"
      style={{ margin: "10%", padding: "20px", textAlign: "center" }}
    >
      <button
        type="button"
        className="waves-effect waves-light btn"
        onClick={() => {

          if (window.location.hostname === "localhost") {
                window.open("http://localhost:4000/auth/google", "_self");
            } else {
                window.open(window.location.origin+"/auth/google", "_self");
            }
        }}
      >
        Sign in with Google{" "}
      </button>
    </div>
  );
};

export default Home;
