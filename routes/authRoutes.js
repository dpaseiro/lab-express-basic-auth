const express    = require('express');
const userRouter = express.Router();
const User       = require('../models/user');
const bcrypt     = require('bcryptjs');

// SIGNUP
userRouter.get('/signup',(req, res, next)=>{
    res.render('signUpPage')
})

// SUCCESS
userRouter.get('/success', (req, res, next)=>{
    res.render('success',)
})

userRouter.post('/signup', (req, res, next)=>{
    const thePassword   = req.body.password;
    const theUsername   = req.body.username;
    
    if(thePassword === "" || theUsername === ""){
        res.render('signUpPage', {errorMessage: 'Please fill in both '
    });
    return;
    }

    User.findOne({username: theUsername})
    .then((responseFromDB)=>{
        if(responseFromDB !== null){
            res.render('signUpPage', {errorMessage: ` Someone already has ${theUsername}`})
            return;
        }
    
    
        const salt          = bcrypt.genSaltSync(10);
        const hashPassword  = bcrypt.hashSync(thePassword, salt);
            User.create({username: theUsername, password: hashPassword})
            .then((response)=>{
                res.redirect('/success')
            })
            .catch((err)=>{
                next(err)
            });
        })
});

// LOGIN
userRouter.get('/login', (req, res, next)=>{
    res.render('loginPage');
});

userRouter.post('/login', (req, res, next)=>{
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if(thePassword === '' || theUsername === ''){
        res.render('loginPage', {errorMessage: "Try again"})
        return;
    }

    User.findOne({'username': theUsername}, (err, user) =>{
        if (err || !user){
            res.render('loginPage', {errorMessage: 'no username'})
            return;
        }

    if (bcrypt.compareSync(thePassword, user.password)){
        req.session.currentUser = user;
        res.redirect('/success');
    }else {
        res.render('loginPage', {
            errorMessage:  'bad pass'
        });
    }
    })
})

userRouter.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/loginPage");
    });
  });

//   MAIN
// userRouter.get('/main',(req, res, next)=>{
//     res.render('main')
// });

userRouter.get('/main', (req, res, next)=>{
    
    if(!req.session.currentUser){
        res.render('loginPage', {errorMessage: 'Login first'});
        return;
    }else{
        res.render('main', {user: req.session.currentUser})
    }

});




// PIRATE
userRouter.get('/private', (req, res, next)=>{
    
    if(!req.session.currentUser){
        res.render('loginPage', {errorMessage: 'private '});
        return;
    }else{
        res.render('private')
    }

});



module.exports = userRouter;