const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSign = async(req, res = response) => {

    const {id_token} = req.body;

    try {
        const { name, email } = await googleVerify( id_token );
        let user = await User.findOne({ email });

        if(!user) {
            const data = { 
                name,
                email,
                password: ':P',
                google: true,
                role: 'USER_ROLE'
             };
             user = new User( data );
             await user.save();           
        }

        // Si el usuario esta en BD
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Pongase en contacto con el administrador de la aplicacion, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            msg: 'Todo bien',
            user,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
        
    }

}

module.exports = {
    login,
    googleSign
}