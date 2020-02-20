module.exports = function(models) {
    models.users.belongsToMany(models.posts, {
        foreignKey: 'UserId'
    });
}