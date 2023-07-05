const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = async ( files, extensionValid = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {
    return new Promise (( resolve, reject ) => {
        const { file } = files;
        const nameShort = file.name.split('.');
        const extension = nameShort[nameShort.length - 1];
        
        if (!extensionValid.includes(extension)) {
            reject(`La extension ${extension} no es permitida`);
        }
    
        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);
    
        file.mv(uploadPath, (err) => {
            if (err) {
                reject({ err })
            }
            resolve(nameTemp)
        });

    })
}

module.exports = {
    uploadFile
}