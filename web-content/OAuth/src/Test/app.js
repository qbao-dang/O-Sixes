const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
var passport = require('passport');


//Get keys
const PropertiesReader = require('properties-reader');
const properties =  PropertiesReader('./resources/config.properties');
const consumerKey = properties.get('consumerKey');
const consumerSecret = properties.get('consumerSecret');


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//setup routes
app.use(authRoutes);

app.get('/', (req, res) =>{
  if (req.isAuthenticated()){
    var output = req.user.id;
    if(req.user.battletag){
      output += req.user.battletag;

    }
    res.render('Home');
  }else{
    res.render('index');
  }
});

app.get('/home', (req, res) =>{
    res.render("home")
});

app.get('/bnet/callback',
passport.authenticate('bnet', { failureRedirect: '/' }),
function(req, res){
  res.redirect('https://localhost:8080/home');
});

app.listen(8080, () =>{
  console.log('listening port 8080');
});
