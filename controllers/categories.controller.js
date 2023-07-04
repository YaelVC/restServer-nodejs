const { response } = require('express');
const { Categorie } = require('../models');

//Obtener categorias - paginado - total - populate
const getCategories = async(req, res = response) => {
    try {
        const { limit = 5, from = 0 } = req.query;
        const query = { status: true }

        const [ total, categories ] = await Promise.all([
            Categorie.countDocuments( query ),
            Categorie.find( query )
                .skip( Number( from ) )
                .limit( Number( limit ) )
                .populate('user', 'name')
        ])
        res.json({
            msg: 'Todo, OK! -get all',
            total,
            categories
        })
        
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
        
    }

}

//Obtener categoria - populate
const getCategoriesById = async(req, res = response) => {
    try {
        const { id } = req.params;
        const category = await Categorie.findById( id ).
        populate('user', 'name');
        res.json({
            msg: 'Todo, OK! - get by id',
            category
        })  
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
        
    }

}

const createCategories = async(req, res = response) => {
    try {
        const name = req.body.name.toUpperCase();

        const categoryDB = await Categorie.findOne({ name });

        if (categoryDB) {
            return res.status(400).json({
                msg: `La categoria ${categoryDB.name} ya existe`
            });
        }

        const data = {
            name,
            user: req.user._id
        }

        const category = new Categorie( data );
        await category.save();

        res.status(201).json({
            msg: 'Todo, OK! -  create a categorie',
            category
        })   
    } catch (error) {
        res.status(400).json({
            msg: error.message
        }) 
    }

}

// Actualizar categoría 
const updateCategories = async(req, res = response) => {
    try {
        const { id } = req.params;
        const { status, user, ...data } = req.body;
        data.name = req.body.name.toUpperCase();
        data.user = req.user._id;
       
        const category = await Categorie.findByIdAndUpdate( id, data, { new: true } )

        res.status(202).json({
            msg: 'Todo, OK! - update a categorie',
            category
        })  
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })  
    }
}

// Borrar categoría
const deleteCategories = async(req, res = response) => {
    try {
        const { id } = req.params;

        const category = await Categorie.findByIdAndUpdate( id, { status: false }, { new: true } );

        res.json({
            msg: `La categoría con ${id} ha sido eliminada exitosamente`,
            category
        })
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

module.exports = {
    createCategories,
    deleteCategories,
    getCategories,
    getCategoriesById,
    updateCategories
}