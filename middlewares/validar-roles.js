const { response, request } = require("express")

const isAdminRol = (req = request, res = response) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role, sin validar el token primero'
        })

    }

    const { role, name } = req.user;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es administrador`
        })
    }
}

const haveRole = (...roles) => {
    return (req = request, res = response, next) => {

        if (!req.user) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role, sin validar el token primero'
            })

        }

        if (!roles.includes( req.user.rol )) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }


        next();

    }
}

module.exports = {
    isAdminRol,
    haveRole
}