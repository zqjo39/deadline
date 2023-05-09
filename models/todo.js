'use strict';
const moment = require('moment');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // todo add relationship (it's on 6.3, slide 17)
    }
  }
  Todo.init({
    description: DataTypes.STRING,
    notes: DataTypes.STRING,
    complete: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    deadline: DataTypes.DATE,
    past: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.deadline).isBefore(moment(), 'day')
      }
    },
    present: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.deadline).isSame(moment(), 'day')
      }
    },
    future: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.deadline).isAfter(moment(), 'day')
      }
    },
    friendlyDate: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.deadline).endOf('day').fromNow()
      }
    },
    completeText: {
      type: DataTypes.VIRTUAL,
      get(){
        return this.complete ? 'Complete' : 'Incomplete'
      }
    }
  }, {
    sequelize,
    modelName: 'Todo',
    tableName: 'deadline_todo',
    timestamps: false
  });
  return Todo;
};