const {Todo, User} = require('../models');

module.exports.listAll = async function(req, res) {
    const todos = await Todo.findAll({
        where: {
            user_id: req.user.id
        }
    });

    // todo define theme and font
    let completeItems = todos.filter(item => item.complete);
    let pastItems = todos.filter(item => item.past && !item.complete);
    let currentItems = todos.filter(item => item.present && !item.complete);
    let futureItems = todos.filter(item => item.future && !item.complete);
    // todo why do the translate functions hate me so much-
        // come back to this later i am so sleep deprived
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

// todo find a way to use these to change fonts and themes; look at idcard for reference
function translateFont(font_id) {
    if (font_id === '1') {
        return 'lucida-grande'
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
        return 'light'
    } else if (theme_id === '2') {
        return 'dark'
    } else if (theme_id === '3') {
        return 'retro'
    } else if (theme_id === '4') {
        return 'pastel'
    } else {
        return ''
    }
}