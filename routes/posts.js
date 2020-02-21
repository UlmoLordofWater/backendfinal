var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function(req, res, next) {

});

router.post('/', function(req, res, next) {

});

router.delete('/:id', function(req, res, next) {
  let id = parseInt(req.params.id);
  models.posts.findByPk(id)
    .then(deletePost => {
      return models.users.update(
        { Deleted: !deletePost.Deleted },
        { where: { UserId: id } }
      )
    }).then(() => res.redirect('/profile'))
});

router.put('/:id', function(req, res, next) {
    
});

module.exports = router;