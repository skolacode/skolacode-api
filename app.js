const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

require('./config/passport-setup');

const { sessionSecret, db } = require('./config/keys');
const  middlewares = require('./middlewares');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');
const feedbackRouter = require('./routes/feedback');

mongoose.connect(db, { useNewUrlParser: true });

const app = express();

app.use(session({
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors
const corsOptions = {
	origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// routes
app.use('/', indexRouter);

const v1 = '/api/v1';
app.use(`${v1}/oauth`, authRouter);
app.use(`${v1}/user`, middlewares.userAuthentication, userRouter);
app.use(`${v1}/articles`, articleRouter);
app.use(`${v1}/feedbacks`, feedbackRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ', server.address().port);
});