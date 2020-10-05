const admin = require('firebase-admin/lib/index');
const {isDev, envVars} = require("./base");

exports.admin = (() =>
    admin.initializeApp(isDev ? {
        credential: admin.credential.cert(JSON.parse(envVars.FIREBASE_ADMIN_SDK)),
        databaseURL: process.env.DB_URL
    } : require('firebase-functions/lib/index').config().firebase))();
