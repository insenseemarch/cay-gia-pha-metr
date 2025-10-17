const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy; 
const db = require('./db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
        const userResult = await db.query(
            "SELECT * FROM users WHERE provider = 'google' AND provider_id = $1", 
            [id]
        );

        if (userResult.rows.length > 0) {
            return done(null, userResult.rows[0]);
        } else {
            const newUserResult = await db.query(
                `INSERT INTO users (username, email, provider, provider_id) 
                 VALUES ($1, $2, 'google', $3) RETURNING *`,
                [displayName, email, id]
            );
            return done(null, newUserResult.rows[0]);
        }
    } catch (err) {
        return done(err, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'] // Yêu cầu Facebook trả về các trường này
},

async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;
    try {
        const userResult = await db.query(
            "SELECT * FROM users WHERE provider = 'facebook' AND provider_id = $1",
            [id]
        );
        if (userResult.rows.length > 0) {
            return done(null, userResult.rows[0]);
        } else {
            const username = displayName || `user_${id}`;
            const newUserResult = await db.query(
                `INSERT INTO users (username, email, provider, provider_id)
                 VALUES ($1, $2, 'facebook', $3) RETURNING *`,
                [username, email, id]
            );
            return done(null, newUserResult.rows[0]);
        }
    } catch (err) {
        return done(err, null);
    }
}));