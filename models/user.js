'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Subscription, {
        as: 'subscription',
        foreignKey: 'subscription_id'
      })
    }
    can(action) {
      let match = this.subscription.permissions.find(function(permission) {
        return permission.name === action
      });

      if(match) return true;
      return false
    }
  };
  User.init({
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    subscription_id: DataTypes.INTEGER,
    font_id: DataTypes.INTEGER,
    theme_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'deadline_users',
    timestamps: false
  });
  return User;
};