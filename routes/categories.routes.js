const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, 
        validarJWT, 
        isAdminRol
} = require('../middlewares');
const { 
        createCategories, 
        deleteCategories, 
        getCategories, 
        getCategoriesById,
        updateCategories, 
} = require('../controllers/categories.controller');
const { existCategoryById } = require('../helpers/db-validators');

const router = Router();

/* 
    {{url}}/api/categories

*/

// Obtener todas las categorias
router.get('/', getCategories )

// Obtener una categoria por id - publico
router.get('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existCategoryById ),
    validarCampos
], getCategoriesById )


// Crear categoria - privado . cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    validarCampos

], createCategories )


// Actualizar un registro por ID privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('id').custom( existCategoryById ),
    validarCampos
] , updateCategories )


// Delete categoria privado - cualquiera con token valido - es administrador
router.delete('/:id', [
    validarJWT,
    isAdminRol,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existCategoryById ),
    validarCampos
] ,deleteCategories )



module.exports = router;