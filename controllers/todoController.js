const {Todo} = require('../models');

module.exports.listAll = async function(req, res) {
    const todos = await Todo.findAll({
        where: {
            user_id: req.user.id
        }
    });

    let completeItems = todos.filter(item => item.complete);
    let pastItems = todos.filter(item => item.past && !item.complete);
    let currentItems = todos.filter(item => item.present && !item.complete);
    let futureItems = todos.filter(item => item.future && !item.complete);
    let font = translateFont(req.user.font_id);
    let theme = translateTheme(req.user.theme_id);
    res.render('todos/viewAll', {
        completeItems,
        pastItems,
        currentItems,
        futureItems,
        font,
        theme
    });
    console.log(theme);
    console.log(font);
};

module.exports.displayAddItem = function(req, res) {
    const item = {
        name: '',
        description: '',
        deadline: new Date(),
        notes: ''
    }
    let font = translateFont(req.user.font_id);
    let theme = translateTheme(req.user.theme_id);
    res.render('todos/newItem', {
        item, font, theme
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
    let font = translateFont(req.user.font_id);
    let theme = translateTheme(req.user.theme_id);
    if (!todo) { // if id cannot be found
        res.redirect('/');
    } else {
        res.render('todos/editItem', {item: todo, font, theme})
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
    let font = translateFont(req.user.font_id);
    let theme = translateTheme(req.user.theme_id);
    res.render('todos/notesItem', {todos, translate, font, theme})
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

function translateFont(font_id) {
    if (font_id === '1') {
        return ''
    } else if (font_id === '2') {
        return 'arial'
    } else if (font_id === '3') {
        return 'times-new-roman'
    } else if (font_id === '4') {
        return 'comic-sans'
    } else {
        return ''
    }
}

function translateTheme(theme_id) {
    if (theme_id === '1') {
        return ''
    } else if (theme_id === '2') {
        return 'dark'
    } else if (theme_id === '3') {
        return 'woodland'
    } else if (theme_id === '4') {
        return 'rose'
    } else {
        return ''
    }
}