var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
const PORT = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.locals.pretty = true;

var routes = require('./public/routes/script');

function methodLogger(request, response, next){
		   console.log("METHOD LOGGER");
		   console.log("================================");
		   console.log("METHOD: " + request.method);
		   console.log("URL:" + request.url);
		   next(); //call next middleware registered
}

function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
           for(k in request.headers) console.log(k);
		   next(); //call next middleware registered
}

app.use(express.static('public'));
app.use(logger('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', routes.index);
app.get('/register', routes.register);
app.get('/guestHome', routes.guestHome);
app.get('/adminHome', routes.adminHome);
app.get('/search', routes.search);
app.get('/users', routes.users);
app.get('/playlist', routes.playlist);
app.get('/logout', routes.logout);

app.post('/register', routes.registerUser);
app.post('/login', routes.login);
app.post('/search', routes.searchSong);
app.post('/playlist', routes.addToPlaylist);

app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000`)
  }
})