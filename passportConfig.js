import User from "./model/user.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

function InitializingPassport(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/api/auth/callback",
        
      },
      function (accessToken, refreshToken, profile, done) {
        console.log('&*&*',process.env.EMAILS.includes(profile._json.email))
   
        if(process.env.WEB_ADMIN_EMAILS.includes(profile._json.email))
       { 
        console.log("**", profile._json);
          User.findOne({ googleId: profile.id }).then((existingUser) => {
            if (existingUser) {
              done(null, existingUser);
            } else {
              new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile._json.email,
              })
                .save()
                .then((user) => {
                  done(null, user);
                });
            }
          });
      }
      else{
        console.log('Only specific Admin can login');
       
      }

      }
    )
  );
}
export default InitializingPassport;
