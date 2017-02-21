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

app.get('/sign-in', function(req,res) {
    res.sendFile(__dirname + '/sign-in.html');
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