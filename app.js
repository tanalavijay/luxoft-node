var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var path = require('path');
var session = require('express-session');
var config = require('./config');
var param = process.argv[2];
var originurl = config[param];
var port = config[param + 'port'];

//table associations for joining the tables
var associations = require('./orm/associations/table_associations');
//routes
var luxoftUserRoutes = require('./routes/userroutes');

//cors options
var corsOptions = {
    origin: originurl,
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//middleware of application.
app.set('port', process.env.PORT || port);
app.use(methodOverride());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setting headers for security eg: x-frame options. 
app.all('*', function(req, res, next) {
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Content-Length', '52250');
    res.header('X-XSS-Protection', '1');
    res.header('Cache-Control', 'no-cache');
    next();
});

app.all('*', function (req, res, next) {
    //Origin is the HTML/Angular domain from where the ExpressJS API would be called.
    res.header('Access-Control-Allow-Origin', originurl);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //make sure you set this parameter and make it true so that Angular and Express are able to exchange session values between each other .
    next();

});
//express session
app.use(session({
    secret: config.sessionSecret,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 5000,
        resave: true,
        rolling: true,
    },
    saveUninitialized: false,
    resave: false,
    rolling: true
}));

//Setting routes to express app.
luxoftUserRoutes.routes(app);

//association set up
associations.setup('./orm/models', config[param + 'DB'].database , config[param + 'DB'].user, config[param + 'DB'].password,config[param + 'DB'].logger, {
    host: config[param + 'DB'].host,
    dialect: config[param + 'DB'].dialect,
    pool: {
        max: config[param + 'DB'].connectionLimit,
        min: 0,
        idle: 10000
    },
});

app.use(function(err, req, res, next) {
    // logger.warn("Error here");
    // console.log(err);
    commonemitter.emit('errorLogEvent', {"created_by":1, "error_msg":err.stack});
    res.status(500).send({ "Error": err.stack });
});

//satrting server.
http.createServer(app).listen(app.get('port'), "0.0.0.0", function() {
    console.log('Server is listening on port ' + app.get('port'));
});