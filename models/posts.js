'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    PostTitle: DataTypes.STRING,
    PostBody: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  posts.associate = function(models) {
    // associations can be defined here
  };
  return posts;
};