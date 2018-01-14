const router = require('express').Router();

//auth login
router.get('/signin', (req, res)=>{
  res.render('');
})

//auth Logout
router.get('/logout', (req, res) => {
//handle with passport
  req.logout();
  res.redirect('/');
});

//auth with Bnet
router.get('/bnet', (req, res) => {
    //handle with Passport
    res.send('login with bnet');
});

module.export = router;
