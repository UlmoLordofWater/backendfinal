var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  models.users.findOrCreate({
    where: {
      Username: req.body.username,
    },
    defaults: {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Email: req.body.email,
      Password: authService.hashPassword(req.body.password)
    }
  })
  .spread(function(result, created) {
    if (created) {
      res.redirect('login');
    } else {
      res.send('This user already exists');
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }})
    .then(user => {
      if (!user) {
        console.log('User not found')
        return res.status(401).json({
          message: 'Login Failed'
        });
      } else {
        let passwordMatch = authService.comparePassword(req.body.password, user.Password);
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie('jwt', token);
          res.redirect('profile')
        } else {
          console.log('Wrong password');
          res.redirect('login');
        }
      }
    });
});

router.get('/profile', function(req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
    .then(user => {
      if (user) {
        models.users.findAll({
          where: { UserId: user.UserId},
          include: [{model: models.posts}]
        }).then(data => {
          if (data) {
            res.render('profile', {
              FirstName: user.FirstName,
              LastName: user.LastName,
              Email: user.Email,
              Username: user.Username
            });
          } else {
            res.send('Must be logged in');
          }
        })
      } else {
        res.send('Must be logged in'); 
      }
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next) {
  res.cookie('jwt', '', {expires: new Date(0)});
  res.send('Logged Out');
  res.redirect('/login');
});

router.get('/admin', function(req, res, next) {
  if (req.user) {
    models.users
      .findByPk(parseInt(req.user.UserId))
      .then(userFoundInDatabase => {
        if (userFoundInDatabase.Admin == true) {
          models.users.findByPk(parseInt(req.params.id)).then(
            userInPram => {
              res.render('specificUser', {
                FirstName: userInPram.FirstName,
                LastName: userInPram.LastName,
                Email: userInPram.Email,
                Username: userInPram.Username,
                Admin: userInPram.Admin,
                UserId: userInPram.UserId,
                Password: userInPram.Password,
                Admin: userInPram.Admin,
                createdAt: userInPram.createdAt,
                updatedAt: userInPram.updatedAt
              });
            }
          )
        } else {
          res.send("You are not authorized to access the page.");
        }
      });
  } else {
    res.redirect('/users/login')
  }
});

router.get('/admin/editUser/:id', function(req, res, next) {
  if (req.user) {
    models.users
      .findByPk(parseInt(req.user.UserId))
      .then(user => {
        models.users
        .findAll({})
        .then(listUsers => {
          if (user) {
            if (user.Admin == true) {
              res.render('listUsers', {users: listUsers});
            } else {
              res.send("You are not authorized to access the page.");
            }
          } else {
            res.send("User not found.")
          }
        })
      })
  } else {
    res.redirect('/users/login')
  }
});

router.delete('/admin/editUser/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  models.users.findByPk(id)
    .then(deleteUser => {
      return models.users.update(
        { Deleted: !deleteUser.Deleted },
        { where: { UserId: id } }
      )
    }).then(() => res.redirect('/users'))
});


module.exports = router;
