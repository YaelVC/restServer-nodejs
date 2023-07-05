const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        require: [ true, 'El nombre es obligatorio' ],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    price: {
        type: Number,
        deafult: 0,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        require: true,
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
})

ProductSchema.methods.toJSON = function() {
    const { __v, status, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

module.exports = model('Product', ProductSchema);