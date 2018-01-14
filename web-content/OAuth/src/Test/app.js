const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-routes');


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//setup routes
app.use('/auth', authRoutes);

app.get('/', (req, res) =>{
  res.render("index");
});

app.listen(8080, () =>{
  console.log('listening port 8080');
});
