const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');

var authService = {
    
    signUser: function(user) {
        const token = jwt.sign({
            Username: user.Username,
            UserId: user.UserId,
            Admin: user.Admin
        }, 'secretKey',
        {
            expiresIn: '1h'
        });
    },

    verifyUser: function(token) {
        try {
            let decoded = jwt.verify(token, 'secretKey');
            return models.users.findByPk(decoded.UserId)
        } catch {
            console.log(err);
            return null;
        }
    },

    hashPassword: function(plainTextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash;
    },

    comparePassword: function(plainTextPassword, hashedPassword) {
        return bcrypt.compareSync(plainTextPassword, hashedPassword)
    }
}

module.exports = authService;