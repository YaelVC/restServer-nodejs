const { response } = require('express');
const { Product, Categorie } = require('../models');

getProducts = async (req, res = response) => {
    try {
        const { limit = 5, from = 0 } = req.query;
        const query = { status: true }

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate('user', 'name')
                .populate('category', 'name')
        ])
        res.json({
            msg: 'Todo, OK! -get all',
            total,
            products
        })
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

getProdutcById = async (req, res = response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('user', 'name')
            .populate('category', 'name');
        res.json({
            msg: 'Todo, OK! - get by id',
            product
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

createProduct = async (req, res = response) => {
    try {
        let { status, user, ...body } = req.body;

        const productDB = await Product.findOne({ name: body.name });

        if (productDB) {
            return res.status(400).json({
                msg: `El producto ${productDB.name} ya existe`
            });
        }

        const categoryDB = await Categorie.findById({ _id: body.category });
        if (!categoryDB || !categoryDB.status) {
            return res.status(400).json({
                msg: `La categoria ${body.category} a la que desea agregar el producto no existe`
            });
        }

        const data = {
            name: body.name.toUpperCase(),
            user: req.user._id,
            ...body
        }

        const product = new Product(data);
        await product.save();


        res.json({
            msg: 'OK',
            product
        })

    } catch (error) {
        res.json({
            msg: error.message
        })
    }

}

updateProduct = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { status, user, ...data } = req.body;

        if (data.name) {
            data.name = req.body.name.toUpperCase();
        }

        data.user = req.user._id;

        const product = await Product.findByIdAndUpdate(id, data, { new: true })

        res.status(202).json({
            msg: 'Todo, OK! - update a product success',
            product
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }

}

deleteProduct = async (req, res = response) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json({
            msg: `El producto con ${id} ha sido eliminado exitosamente`,
            product
        })

    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}


module.exports = {
    getProducts,
    getProdutcById,
    createProduct,
    updateProduct,
    deleteProduct

}