const { Schema, model } = require('mongoose');

const categorieSchema = Schema({
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
    }
    
})

categorieSchema.methods.toJSON = function() {
    const { __v, status, _id, ...categorie } = this.toObject();
    categorie.uid = _id;
    return categorie;
}

module.exports = model('Categorie', categorieSchema);