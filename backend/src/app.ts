import { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MONGO_CONFIG } from './constants/api.constants';
import { loadControllers } from "awilix-express";
import { loadContainer } from "./container";
import fileUpload from 'express-fileupload';

class App {

    /**
     * A public property of the class. 
    */
    public app: Application;

    /**
     * This function sets up the express app, sets up the default configuration,
     * sets up the mongo
     * configuration, sets up the routes, and sets up the error handling middleware.
     */
    constructor() {
        this.app = express();
        this.defaultConfig();
        this.mongoConfig();
    }

    /**
     * This function sets up the default configuration for the express server.
     */
    private defaultConfig() {
        dotenv.config();
        this.app.use(fileUpload());
        this.createRawBody();
        this.app.use(helmet());
        this.app.use(cors());
        this.app.set('view engine', 'ejs');
        this.app.use(express.static('public'));
        loadContainer(this.app);
        this.app.use('/api', loadControllers(
            'controllers/*.ts',
            { cwd: __dirname }
        ));
    }

    /**
     * Connect to the mongo database and set the virtuals to true and delete the _id
     */
    private mongoConfig() {
        // Get Mongoose to use the global promise library
        mongoose.Promise = global.Promise;
        mongoose.connect(MONGO_CONFIG.url)
            .then(() => console.log(`Connected to mongo database ${MONGO_CONFIG.url}`))
            .catch((error) => console.log(`${error} did not connect`));
        mongoose.set("toJSON", {
            virtuals: true,
            transform: (_: any, converted: any) => {
                delete converted._id;
            },
        });
    }

    /**
     * It takes the request body, converts it to a string, 
     * and then adds it to the request object as a
     * property called rawBody.
     */
    private createRawBody(): void {
        const rawBodySaver = function (req: any, res: any, buf: any, encoding: any) {
            if (buf && buf.length) {
                req.rawBody = buf.toString(encoding || 'utf8');
            }
        }
        this.app.use(bodyParser.json({ verify: rawBodySaver, limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true, limit: '50mb' }));
        // this.app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*', limit: '50mb' }));
    }
}

export default new App().app