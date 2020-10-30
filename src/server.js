const {isDev} = require("./base");
module.exports = (() => {
    /**
     * Map all available handlers to express route.
     * @type {{handler}|*}
     */
    const {baseDir} = require("./base");
    const fs = require('fs');
    const express = require('express');
    const cors = require('cors')
    const bodyParser = require('body-parser');
    const serverName = require(`${baseDir}/package.json`).name
    const logger = require('bunyan').createLogger({name: serverName, level: isDev ? 'debug' : 'error'});
    const server = express({name: serverName, log: logger});
    const router = express.Router();
    const baseHandlersFolder = `${baseDir}/src/handlers`;
    fs.readdirSync(baseHandlersFolder).forEach((fileName) => {
        if (fileName.includes('.js')) {
            const HandlerImport = require(`${baseHandlersFolder}/${fileName}`);
            Object.keys(HandlerImport).forEach((handler) => {
                try {
                    const methods = HandlerImport[handler].type || ['get'];
                    (Array.isArray(methods) ? methods : [methods]).forEach((method) =>
                        router[method ? method : 'get'](`${handler === 'all' ? '*' : '/' + handler}${HandlerImport[handler].url ? HandlerImport[handler].url : ''}`, HandlerImport[handler].exec ? HandlerImport[handler].exec : HandlerImport[handler]));
                    logger.info(handler === 'all' ? '*' : '/' + handler)
                } catch (e) {
                    console.error(e);
                    logger.error(`Failed to register the following handler: ${handler}`);
                }
            })
        }
    });

    return server
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({extended: true}))
        .use(require('express-bearer-token')())
        .use(cors({origin: true}))
        .use(isDev ? '/api': '', router)
})();