/**
 * Get status (health check for FB)
 * @param req
 * @param res
 */
exports.status = (req, res) => res.status(200).send("I'm alive!").end();
