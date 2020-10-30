const {auth} = require("../utils");
const firebase = require('../firebase').admin
const expiresIn = 60 * 60 * 24 * 2 * 1000 // TODO: Change this hardcoded value to a firebase remoteConf one, and pass the value back to the portal

module.exports = {
    status: (req, res) => res.send("I'm alive!").status(200),
    login: {
        /**
         * Create a API custom token for accessing all microservices
         * @param req uid(STR)
         * @param res custom access token (STR)
         */
        type: ['post'], exec: async (req, res) =>
            req.body.token ?
                firebase.auth().verifyIdToken(req.body.token)
                    .then(() => firebase.auth().createSessionCookie(req.body.token, {expiresIn})
                        .then(sessionCookie => res.send(sessionCookie).status(200).end())
                        .catch(err => res.send(`An error has occurred - ${err.message}`).status(500).end()))
                    .catch(() => res.send('Access denied!').status(401))
                : res.send('Missing params!').status(400)
    },
    check_login: (req, res) => req.token ?
        auth(req.token).then(access => access ?
            res.send("Authenticated!").status(200)
            : res.send("Access denied!").status(403)
        ) : res.send("Access denied!").status(403)
}