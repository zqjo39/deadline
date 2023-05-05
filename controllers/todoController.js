const { Todo } = require('../models');
const moment = require('moment');


module.exports.listAll = async function(req, res) {
    const todos = await Todo.findAll({
        where: {
            user_id: req.user.id
        }
    });

    let completeItems = todos.filter(item => item.complete);
    let incompleteItems = todos.filter(item => !item.complete);
    // todo FIGURE OUT HOW TO SEPARATE PAST AND PRESENT AND WE'RE GOLDEN
    // oh and also complete items are appearing in the incomplete, figure out how to fix that too
    let pastItems = todos.filter(item => item.past);
    let currentItems = todos.filter(item => item.present);
    let futureItems = todos.filter(item => item.future);

    res.render('todos/viewAll', {
        completeItems,
        incompleteItems,
        pastItems,
        currentItems,
        futureItems
    });
};


module.exports.displayAddItem = function(req, res) {
    const item = {
        name: '',
        description: '',
        deadline: new Date(),
        notes: ''
    }
    res.render('todos/newItem', {
        item
    })
};

module.exports.addNewItem = async function(req, res){
    await Todo.create({
        description: req.body.description,
        deadline: req.body.deadline,
        notes: req.body.notes,
        user_id: req.user.id
    });
    res.redirect('/');
};


module.exports.viewEditItem = async function(req, res) {
    const todo = await Todo.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }});
    if (!todo) { // if id cannot be found
        res.redirect('/');
    } else {
        res.render('todos/editItem', {item: todo})
    }
};


module.exports.saveEditItem = async function(req, res) {
    await Todo.update({
        description: req.body.description,
        notes: req.body.notes,
        deadline: req.body.deadline
        }, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


module.exports.deleteItem = async function(req, res) {
    await Todo.destroy({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }
    })
    res.redirect('/');
};


module.exports.makeItemComplete = async function(req, res) {
    await Todo.update({complete: true}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


module.exports.markItemIncomplete = async function(req, res) {
    await Todo.update({complete: false}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


module.exports.viewNote = async function(req, res) {
    const todos = await Todo.findByPk(req.params.id);
    let translate = translateBooleanToComplete(todos);
    res.render('todos/notesItem', {todos, translate})
}

function translateBooleanToComplete(item) {
    const isComplete = item.complete;
    if (isComplete === true) {
        return 'Completed!'
    } else {
        return 'Not Completed...'
    }
    return isComplete;
}