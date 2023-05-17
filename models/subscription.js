'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subscription.belongsToMany(models.Permission, {
        through: models.SubscriptionPermission,
        as: 'permissions',
        foreignKey: 'subscription_id',
        otherKey: 'permission_id'
      })
    }
  }
  Subscription.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'deadline_subscriptions',
    timestamps: false
  });
  return Subscription;
};