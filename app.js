/**
 * Created by robin on 21/02/2017.
 */
var express = require('express');
var path = require('path');

var app = express();

app.use('/assets', express.static('assets'));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/sign-in.html', function(req,res) {
    res.sendFile(__dirname + '/sign-in.html');
});

app.get('/sign-up', function(req,res) {
    res.sendFile(__dirname + '/sign-up.html');
});

app.get('/about', function(req,res) {
    res.sendFile(__dirname + '/about.html');
});

app.get('/admin', function(req,res) {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/game', function(req,res) {
    res.sendFile(__dirname + '/game.html');
});

app.get('/how-to-play', function(req,res) {
    res.sendFile(__dirname + '/how-to-play.html');
});

app.get('/new-password', function(req,res) {
    res.sendFile(__dirname + '/new-password.html');
});

app.get('/options', function(req,res) {
    res.sendFile(__dirname + '/options.html');
});

app.get('/password-reset', function(req,res) {
    res.sendFile(__dirname + '/password-reset.html');
});

app.get('/scoreboard', function(req,res) {
    res.sendFile(__dirname + '/scoreboard.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development - shows your error on the 404 screen - comment out after development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.sendFile(__dirname + '/error.html');
});

module.exports = app;

app.listen(3000);