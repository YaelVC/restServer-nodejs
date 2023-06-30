const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Conexión a la BD
        this.conectarBD();

        // Middelwares
        this.middlewares();


        //Routes
        this.routes();

    }

    async conectarBD () {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Directorio Publico
        this.app.use(express.static('public'));
        // Parseo y lectura del body
        this.app.use( express.json() )


    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }

}

module.exports = Server;