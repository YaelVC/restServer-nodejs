const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, 
        deleteProduct, 
        updateProduct,
        createProduct,
        getProdutcById
} = require('../controllers/products.controller');
const { validarJWT, 
        validarCampos, 
        isAdminRol} = require('../middlewares');
const { existProductById, existCategoryById } = require('../helpers/db-validators');
const router = Router();

// Obtener los productos
router.get('/', getProducts);

// Obtener los productos por id
router.get('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existProductById ),
    validarCampos
]
, getProdutcById);

// Crear un producto
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('category', 'La categoria es obligatoria').
    notEmpty(),
    check('category', 'No es id de Mongo válido').isMongoId(),
    check('category').custom( existCategoryById ),
    validarCampos
]
, createProduct);

// Actualizar un producto
router.put('/:id', [
    validarJWT,
    check('id', 'No es id de Mongo válido').isMongoId(),
    check('id').custom( existProductById ),
    validarCampos
] , updateProduct);

// Eliminar un producto
router.delete('/:id', [
    validarJWT,
    isAdminRol,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom( existProductById ),
    validarCampos
] , deleteProduct)

module.exports = router;