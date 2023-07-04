const { Role, User, Categorie, Product} = require('../models');

const isRoleValid = async (role = '') => {
    const existRol = await Role.findOne({ role });
    if (!existRol) {
        throw new Error(`El rol ${role} no esta registrado en la base de datos`)
    }

}

const emailExist = async ( email = '' ) => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
       throw new Error(`El email ${email} ya esta registrado`)
    }
}

const existUserById = async( id = '' ) => {
    const existUser = await User.findById(id);
    if ( !existUser ) {
        throw new Error(`No existe un usuario con ese id`)
    }
}

// Aqui va la validacion si existe la categoria
const existCategoryById = async( id = '' ) => {
    const existCategory = await Categorie.findById(id);
    if ( !existCategory ) {
        throw new Error(`No existe una categoría con ese id`)
    }
}

// Aqui va la validacion si existe el producto
const existProductById = async( id = '' ) => {
    const existProduct = await Product.findById(id);
    if ( !existProduct ) {
        throw new Error(`No existe un producto con ese id`)
    }
}




module.exports = {
    isRoleValid,
    emailExist,
    existUserById,
    existCategoryById,
    existProductById
    
}