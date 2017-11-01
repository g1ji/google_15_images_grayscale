
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
const execSync = require('child_process').execSync;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', function (req, res) {
     var query =  req.query.q;
     var reqId = Date.now();
     var code = execSync("python serchgoogle.py '"+query+"' '"+reqId+"'");
     var google_img = fs.readFileSync('./public/upload/'+reqId+'/google_img_links.txt').toString();
     console.log(google_img);
     var local_links = fs.readFileSync('./public/upload/'+reqId+'/local_links.txt').toString();
     res.setHeader('Content-Type', 'application/json');
     res.send(JSON.stringify({
        google_img:google_img,
        local_links:local_links
})
     );
// res.setHeader('Content-Type', 'application/json');
// res.send(JSON.stringify({
// google_img:["https://logos.textgiraffe.com/logos/logo-name/Gaurav-designstyle-i-love-m.png", "http://images.indianexpress.com/2015/08/gaurav-chopra-759.jpg", "https://i.ytimg.com/vi/GGoh0TmT5Tc/maxresdefault.jpg", "https://logos.textgiraffe.com/logos/logo-name/Gaurav-designstyle-birthday-m.png", "http://www.bollywoodlife.com/wp-content/uploads/2016/09/gaurav-arora-gauri-270916.jpg", "http://buzz.iloveindia.com/wp-content/uploads/2016/10/gaurav3.jpg", "http://gauravbhalla.com/wp-content/uploads/2016/07/gaurav-footer-logo2.png", "http://martjackstorage.azureedge.net/in-resources/0203cecf-8d20-4d10-a3b5-58337f8a4cd1/Images/ProductImages/Large/300%20x%20300%20-%20Gaurav.png", "https://i.ytimg.com/vi/1akdapwjWGk/maxresdefault.jpg", "http://images.indianexpress.com/2015/04/gaurav-chopra-759.jpg", "https://logos.textgiraffe.com/logos/logo-name/Gaurav-designstyle-pastel-m.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Gaurav_Gera.jpg/220px-Gaurav_Gera.jpg", "http://www.biggboss11contestants.com/wp-content/uploads/2016/10/Gaurav-Chopra-1.jpg", "http://images.indianexpress.com/2016/10/gaurav-akanksha-759.jpg"],
//          local_links:["1509565340", "1509565342", "1509565344", "1509565346", "1509565348", "1509565350", "1509565352", "1509565353", "1509565355", "1509565358", "1509565360", "1509565363", "1509565366", "1509565368"]

// }));

});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
