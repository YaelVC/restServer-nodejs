const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSign } = require("../controllers/auth.controller");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post('/login', [
    check( 'email', 'El correo es obligatorio' ).isEmail(),
    check( 'password', 'La contraseña es obligatoria' ).notEmpty(),
    validarCampos
] ,
login);

router.post('/google', [
    check( 'id_token', 'Token de Google es necesario' ).notEmpty(),
    validarCampos
] ,
googleSign);




module.exports = router;