const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFiles, 
        updateFiles, 
        getPathImg, 
        updateFilesCloudinary 
} = require('../controllers/uploads.controller');
const { validarCampos, 
        validarJWT, 
        validateFileUpload
} = require('../middlewares');
const { collectionsAllowed } = require('../helpers');
const router = Router();

router.post('/:collection/:id', [
    validarJWT,
    [validateFileUpload],
    validarCampos
]
, updateFilesCloudinary);

router.put('/:collection/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validateFileUpload,
    check('collection').custom( c => collectionsAllowed(c, ['users', 'products', 'categories']) ),
    validarCampos
],
updateFiles );

router.get('/:collection/:id', [ 
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('collection').custom( c => collectionsAllowed(c, ['users', 'products', 'categories']) ),
    validarCampos
 ], getPathImg)

module.exports = router;