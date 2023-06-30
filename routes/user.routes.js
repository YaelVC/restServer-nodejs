const { Router } = require('express');
const { getUsers, 
        putUsers, 
        postUsers, 
        deleteUsers, 
        patchUsers 
      } = require('../controllers/user.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isRoleValid, emailExist, existUserById } = require('../helpers/db-validators');
const router = Router();



router.get('/', getUsers );

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existUserById ),
  check('role').custom( isRoleValid ),
  validarCampos
],
putUsers);

router.post('/', [
  check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
  check( 'password', 'El password debe contener mas de 6 letras' ).isLength({ min: 6 }),
  check( 'email', 'El correo no es válido' ).isEmail(),
  check('role').custom( isRoleValid ),
  check('email').custom( emailExist ),
  validarCampos
], 
postUsers);

router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom( existUserById ),
validarCampos
],
deleteUsers);

router.patch('/', patchUsers);

module.exports = router;