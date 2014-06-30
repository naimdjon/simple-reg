express = require('express');
app = express();
var routes = require('./backend/routes');
var categories = require('./backend/routes/categories');
var items = require('./backend/routes/items');
var orders = require('./backend/routes/orders');
require('./backend/mime')
moment = require('moment');
//require('./backend/rewrites')
//moment = require('moment');

require('./backend/load_models');
var basicAuthConnect= require('basic-auth-connect');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.set('views', __dirname + '/frontend/views');
app.set('view engine', 'ejs');
app.use(require('stylus').middleware({src: __dirname + '/frontend/static/'}));
app.use(express.static(__dirname+'/frontend/static'));
app.use('/simple-reg', express.static(__dirname + '/frontend/static'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride());
//app.use(logErrors);
//app.use(clientErrorHandler);
//app.use(errorHandler);

//app.use(express.errorHandler());
//app.use(express.logger('dev'));

// Synchronous Function
var auth = basicAuthConnect(function(user, pass) {
    return user == '1' && pass=='1';
});

app.get('/', routes.index );
app.post('/orders/submitOrder', orders.submitOrder);
app.get('/orders/all/:fromDate', orders.all);
app.get('/adminside/alleordre', auth, orders.adminAll);

var port=process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port '+port);


function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function clientError(err, req, res, next) {
    if (req.xhr) {
        res.send(500, { error: 'Something blew up!' });
    } else {
        next(err);
    }
}


function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}