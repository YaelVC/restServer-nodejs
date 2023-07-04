const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Categorie, Product } = require('../models');

const collectionsActives = [
    'users',
    'categories',
    'products',
    'roles'
]

const searchUser = async( concept = '', res = response ) => {
    const isMongoId = ObjectId.isValid( concept );
    if (isMongoId) {
        const user = await User.findById( concept );
        return res.json({
            results: ( user ) ? [ user ] : []
        })
    }

    const regex = new RegExp( concept, 'i' );
    const query = { 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    }

    const users = await User
                    .find(query);

    return res.json({
        results: ( users ) ? [ users ] : []
    })
}

const searchCategory = async(concept = '', res = response) => {
    const isMongoId = ObjectId.isValid( concept );
    if (isMongoId) {
        const category = await Categorie.findById( concept );
        return res.json({
            results: ( category ) ? [ category ] : []
        })
    }

    const regex = new RegExp( concept, 'i' );
    const query = { 
        $or: [{ name: regex }],
        $and: [{ status: true }]
    }

    const categories = await Categorie
                    .find(query);

    return res.json({
        results: ( categories ) ? [ categories ] : []
    })

}

const searchProducts = async(concept = '', res = response) => {
    const isMongoId = ObjectId.isValid( concept );
    if (isMongoId) {
        const product = await Product.findById( concept )
                                .populate('user', 'name')
                                .populate('category', 'name');
        return res.json({
            results: ( product ) ? [ product ] : []
        })
    }

    const regex = new RegExp( concept, 'i' );
    const query = { 
        $or: [{ name: regex } ],
        $and: [{ status: true }]
    }

    const products = await Product
                    .find(query)
                    .populate('user', 'name')
                    .populate('category', 'name');

    return res.json({
        results: ( products ) ? [ products ] : []
    })

}

const search = async (req, res = response) => {

    try {
        const { collection, concept } = req.params;
        if (!collectionsActives.includes( collection )) {
            return res.status(400).json({
                msg: 'Las colecciones permitidas son',
                collectionsActives
            })
        }
        
        switch ( collection ) {
            case 'users':
                searchUser(concept, res);
            break;
    
            case 'categories':
                searchCategory(concept, res)
            break;
    
            case 'products':
                searchProducts(concept, res)
    
            break;
    
            case 'roles':
    
            break;
    
            default:
                res.status(500).json({
                    msg: 'Se me olvido hacer esta busqueda'
                })   
        }
        
    } catch (error) {
        res.status(400)
            .json({
                msg: error.message
            })
        
    }
   
}

module.exports = {
    search
}