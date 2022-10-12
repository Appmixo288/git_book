import express from "express";
import path from "path";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import expressSession from "express-session";
import User from "./model/user.js";
import initializingPassport from "./passportConfig.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// database connection
connectDB();

const app = express();
app.use(cors());

app.use(express.static(path.resolve(__dirname, "client/build")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT;

// passport initialize
initializingPassport(passport);

app.use(
  expressSession({
    secret: "secreat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    { failureRedirect: "/auth/google/failure" }
  ),
  (req, res) => {
    console.log("res", res);
    res.render("/");
  }
);

app.get(
  "/api/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/current_user",
    failureRedirect: "/fail",
  })
);

app.get("/current_user", (req, res) => {
  res.send(req.user);
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {});
  res.send(req.user);
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.get("/fail", (req, res) => {
  res.send({ message: "Welcome to Kristagram Admin" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () =>
  console.log(`server is running successfully on port ${PORT}`)
);
