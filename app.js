require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./configs/passportConfig');
const authRoute = require('./routes/authRoute');
const oauthRoute = require('./routes/oauthRoute');
const profileRoute = require('./routes/profileRoute');
const commentRoute = require('./routes/commentRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const movieRoute = require('./routes/movieRoute');
const watchedMovieRoute = require('./routes/watchedMovieRoute');
const subtitleRoute = require('./routes/subtitleRoute');
const { authentication, jwt } = require('./middleware/authentication');
const errorHandler = require('./middleware/errorHandler');
const cron = require('./configs/cron');

const app = express();
cron();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(jwt);
app.use(passport.initialize());
app.use('/api/oauth', oauthRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', authentication, profileRoute);
app.use('/api/comment', authentication, commentRoute);
app.use('/api/favorite', authentication, favoriteRoute);
app.use('/api/movie', authentication, movieRoute);
app.use('/api/watchedMovie', authentication, watchedMovieRoute);
app.use('/api/subtitle', authentication, subtitleRoute);
app.use('/api/image', express.static('image'));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use(errorHandler);
module.exports = app;
