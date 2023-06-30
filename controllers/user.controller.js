const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getUsers = async (req, res = response) => {
    try {
        const { limit = 5, from = 0,  } = req.query;
        const query = { state: true };
      
        const [total, usuarios] = await Promise.all([
            User.countDocuments( query ),
            User.find(query)
                .skip( Number( from ) )
                .limit( Number( limit ) )
        ])
        res.json({
                total,
                usuarios
            })
    } catch (error) {
        res.json(error.message)   
    }
}

const putUsers = async(req, res = response) => {
    try {
        const { id } = req.params;
        const { password, google, email,  ...resto } = req.body;
    
        if( password ) {
             // Encriptar la contraseña
             const salt =  bcryptjs.genSaltSync();
             resto.password = bcryptjs.hashSync( password, salt );
        }
    
        const user = await User.findByIdAndUpdate( id, resto );
     
        res.status(202)
        res.json({
            msg: 'put - API- controlador',
            user
        })        
    } catch (error) {
        console.log(error.message);
    }
};

const postUsers = async (req, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User( {name, email, password, role} );

    try {
        // Encriptar la contraseña
        const salt =  bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );

        // Guardar el usuario en la bd
        await user.save();

        const { name } = req.body;
        if (name) {
            res.status(202)
            res.json({
                msg: `post - API- controlador ${name}`,
                user
            })
        } else {
            res.status(400)
            res.json({
                msg: 'No se envíaron los datos necesarios'
            })
        }

    } catch (error) {
        console.log(error.message);
        res.status(400);
        res.send(error.message);

    }

}

const patchUsers = (req, res = response) => {
    res.status(403)
    res.json({
        msg: 'patch - API- controlador'
    })
}

const deleteUsers = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        // Fisicamente **No se debe hacer
        // const usuario = await User.findByIdAndDelete( id );

        //Eliminación logica
        const usuario = await User.findByIdAndUpdate( id, { state: false } );
        res.json({
            msg: `El usuario con ${id} ha sido eliminada exitosamente`,
            usuario,
        })
    } catch (error) {
        
    }
   
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    patchUsers,
    deleteUsers
}