export const PORT = 5003;
export const WELCOME_MESSAGE = `Server Running on Port: http://localhost:${PORT}`;
export const MONGO_CONFIG = {
    url: 'mongodb://DESKTOP-0ODFC0L:27000,DESKTOP-0ODFC0L:27001,DESKTOP-0ODFC0L:27002?replicaSet=rs',
    configuration: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
}