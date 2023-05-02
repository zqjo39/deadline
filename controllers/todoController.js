const { Todo } = require('../models');


module.exports.listAll = async function(req, res) {
    const todos = await Todo.findAll({
        where: {
            user_id: req.user.id
        }
    });

    let completeItems = todos.filter(item => item.complete);
    let incompleteItems = todos.filter(item => !item.complete);

    res.render('todos/viewAll', {
        completeItems,
        incompleteItems
    });
};


module.exports.displayAddItem = function(req, res) {
    const item = {
        name: '',
        description: '',
    }
    res.render('todos/newItem', {
        item
    })
};

module.exports.addNewItem = async function(req, res){
    await Todo.create({
        description: req.body.description,
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
    await Todo.update({ description: req.body.description}, {
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
    await Todo.update({ complete:  true}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


module.exports.markItemIncomplete = async function(req, res) {
    await Todo.update({ complete:  false}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


