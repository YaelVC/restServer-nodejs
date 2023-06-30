const Role = require('../models/role');
const User = require('../models/user');

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

const existUserByEmail = async( email = '' ) => {
    const existUser = await User.findOne({ email });
    if ( !existUser ) {
        throw new Error(`No existe un usuario con ese email en la base de datos`)
    }
}

module.exports = {
    isRoleValid,
    emailExist,
    existUserById,
    existUserByEmail
}