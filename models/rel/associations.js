module.exports = function(models) {
    models.users.belongsTo(models.posts, {
        foreignKey: 'UserId'
    });
}