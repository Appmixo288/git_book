import express from "express";
import path from "path";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import expressSession from "express-session";
import initializingPassport from "./authorization/passportConfig.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// database connection
connectDB();

const app = express();
app.use(cors());
app.use(cookieParser());

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
    return res.redirect("/fail");
  }
);

app.get("/api/auth/callback", (req, res) => {
  passport.authenticate("google", function (err, user, info) {
    console.log("hi2", user);
    console.log("hi3", info);

    if (err) {
      console.log("hi1", err);
    }
    if (!user) {
      return res.redirect("/fail");
    }
    if (user) {
      // res.cookie("userData", user.id);
      res.redirect("/dashBoard");
      return res;
    }

    // req / res held in closure
    // req.logIn(user, function (err) {
    //   if (err) {
    //     console.log("hi1", err);
    //   }
    //   return res.redirect("/dashBoard");
    // });
  })(req, res);
  (req, res) => {
    console.log("res", res);
    res.redirect("/fail");
  };
});

// app.get("/current_user", (req, res) => {
//   res.cookie("userData", "abc");
//   res.redirect("/dashboard");
//   // console.log('*********',req.user)
//   // res.send(req.user);
// });

app.get("/api/logout", (req, res) => {
  req.logout(() => {});
  res.send(req.user);
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Only specific Admin can login1");
});

app.get("/fail", (req, res) => {
  console.log("first");
  res.send({ message: "Only specific Admin can login" });
});

app.use(express.static(path.resolve(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

app.listen(PORT, () =>
  console.log(`server is running successfully on port http://localhost:${PORT}`)
);
