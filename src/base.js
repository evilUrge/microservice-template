const isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'
module.exports = {
    baseDir: require('path').join(__dirname, '..'),
    isDev: isDev,
    envVars: ((env = isDev ? process.env :
        require('firebase-functions').config().env) => env ? Object.keys(env).reduce((c, k) => (c[k.toUpperCase()] = env[k], c), {}) : {})()
}