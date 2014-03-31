var express = require('express'),
    cons = require('consolidate'),
    swig = require('swig'),
    app = express(),
    guid = require('./models/Guid');

var isProd = false;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('view cache', false);
app.set('views', __dirname + '/views');
app.set('view cache', isProd);
swig.setDefaults({ cache: isProd });

app.use(express.bodyParser());
app.use('/static', express.static('./static'));
app.use(app.router);
app.use(function (err, req, res, next) {
    console.error(err);
    res.statusCode = 500;
    var year = (new Date()).getFullYear();
    res.render("500", {title: "Error", error: err, year: year });
});

app.get('/', function (req, res, next) {
    var year = (new Date()).getFullYear();
    res.render('index', { year: year, guidCount: guid.list.length, isProd: isProd });
});

app.post('/donate', function (req, res, next) {
    var donatedGuid = req.body.guid;
    if (!donatedGuid){
        res.json({ error: 'Not a valid Guid' });
    } 
    else if (guid.list.indexOf(donatedGuid) > -1) {
        res.json({ error: 'Guid has already been donated.' });
    }
    else {
        guid.list.push(donatedGuid);
        res.json({ success: true, message: "Donated successfully!", count: guid.list.length });
    }
    // res.send('donated');
});
app.post('/borrow', function (req, res, next) {
    if (guid.list.length === 0) {
        res.json({error: "No guids left!"});
    } else {
        res.json({ guid: guid.list.pop(), count: guid.list.length, message: "Guid borrowed." });
    }
});

app.get('*', function (req, res, next) {
    var year = (new Date()).getFullYear();
    res.statusCode = 404;
    res.render('404', {title: "Page Not Found", year: year});
});

var port = Number(process.env.PORT || 8000);
app.listen(port);
console.log("Server listening on port " + port);
