const validarCampos = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar-jwt');
const haveRole  = require('../middlewares/validar-roles');
const isAdminRol = require('../middlewares/validar-roles');
const validateFile = require('../middlewares/validate-file')

module.exports = {
   ...validarCampos,
   ...validarJWT,
   ...haveRole,
   ...isAdminRol,
   ...validateFile
}