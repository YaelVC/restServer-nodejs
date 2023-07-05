const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

const uploadFiles = async (req, res = response) => {
    try {
        const nameFile = await uploadFile(req.files, ['txt', 'md'], 'textos');
        res.json({
            nameFile
        })
    } catch (error) {
        res.status(400).json({
            error
        })

    }
}

const updateFiles = async (req, res = response) => {
    try {
        const { collection, id } = req.params;

        let model;

        switch (collection) {
            case 'users':
                model = await User.findById(id);
                console.log();
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    })
                }

                break;

            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }

                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }

        // Limpiar imagenes previas
        try {
            if (model.img) {
                // Hay que borrar la img del servidor
                const pathImg = path.join(__dirname, '../uploads', collection, model.img);
                if (fs.existsSync(pathImg)) {
                    fs.unlinkSync(pathImg);
                }
            }
        } catch (error) {
            return res.status(400).json({
                msg: error.message
            })

        }

        const nameFile = await uploadFile(req.files, undefined, collection);

        model.img = nameFile;

        await model.save();

        res.json({
            msg: 'todo OK',
            model

        })

    } catch (error) {
        res.status(400).json({
            msg: error.message
        })

    }

}

const getPathImg = async (req, res = response) => {
    try {
        const { collection, id } = req.params;

        let model;

        switch (collection) {
            case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
                break;
            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
                break;
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }

        // Limpiar imagenes previas
        try {
            if (model.img) {
                // Hay que borrar la img del servidor
                const pathImg = path.join(__dirname, '../uploads', collection, model.img);
                if (fs.existsSync(pathImg)) {
                    return res.sendFile(pathImg);
                }
            }
        } catch (error) {
            return res.status(400).json({
                msg: error.message
            })
        }

        const imgNotFoundPath = path.join(__dirname, '../public/assets/no-fotos.png');

        res.sendFile(imgNotFoundPath)


    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

const updateFilesCloudinary = async (req, res = response) => {
    try {
        const { collection, id } = req.params;

        let model;

        switch (collection) {
            case 'users':
                model = await User.findById(id);
                console.log();
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    })
                }

                break;

            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }

                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar esto' })
        }

        // Limpiar imagenes previas
        try {
            if (model.img) {

                const nameShort = model.img.split('/');
                const nameImg = nameShort[ nameShort.length - 1];
                const [ public_id ] = nameImg.split('.');

                cloudinary.uploader.destroy( public_id );
            }

            const { tempFilePath } = req.files.file;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

            model.img = secure_url;
            await model.save();
            res.json({
                msg: 'todo OK',
                model
            })

        } catch (error) {
            return res.status(400).json({
                msg: error.message
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

module.exports = {
    uploadFiles,
    updateFiles,
    updateFilesCloudinary,
    getPathImg,
    
}