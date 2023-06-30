const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
    try {
        const { email, password } = req.body;
        
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: 'Usuario / no son correctos - correo'
            })
        }

        // Si el usuario esta activo
        if(!user.state) {
            return res.status(400).json({
                msg: 'El usuario no esta activo'
            })
        }

        // Verificar contraseña
        const validatePassword = bcryptjs.compareSync( password, user.password );
        if(!validatePassword) {
            return res.status(400).json({
                msg: 'Password no coincide'
            })
        }

        // Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            msg: 'Login OK',
            user,
            token
        }) 
    } catch (error) {
        console.log('error');
        res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
}

module.exports = {
    login
}