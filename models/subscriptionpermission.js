'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubscriptionPermission.init({
    subscription_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'SubscriptionPermission',
    tableName: 'deadline_subscription_permissions',
    timestamps: false
  });
  return SubscriptionPermission;
};