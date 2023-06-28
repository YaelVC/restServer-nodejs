const { response, request } = require('express');

const getUsers = (req, res = response) => {
    res.status(200)
    res.json({
        msg: 'get -API - controlador'
    })
}

const putUsers = (req,  res = response) => {
    const { id } = req.params;
    console.log(id);
    res.status(202)
    res.json({
        msg: 'put - API- controlador'
    })
    
};

const postUsers = (req, res = response) => {
    console.log(req.body);
    const{ name, age } = req.body;
    if (name) {
        res.status(202)
        res.json({
            msg: `post - API- controlador ${name}`
        })
    } else {
        res.status(400)
        res.json({
            msg: 'No se envíaron los datos necesarios'
        })
    }
}

const patchUsers = (req, res = response) => {
    res.status(403)
    res.json({
        msg: 'patch - API- controlador'
    })
}

const deleteUsers = (req = request, res = response) => {
    const { name } = req.params;
    const { age, school } = req.query;
    console.log(name);
    console.log(age);
    console.log(school);

    res.status(403)
    res.json({
        msg: `${name} ha sido eliminada exitosamente`,
        age,
        school
    }) 
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    patchUsers,
    deleteUsers
}