const jwt = require('jsonwebtoken')

class AuthMiddleware {
    static #TOKEN_SECRET = require('crypto').createHash('sha256').update('ANDY-JWT-SECRET', 'binary').digest('hex')

    static authenticateRequest(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, AuthMiddleware.#TOKEN_SECRET, (err, user) => {
            console.log(err)

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
    }
    static generateToken(payload) {
        return jwt.sign(payload, AuthMiddleware.#TOKEN_SECRET, { expiresIn: '7200s' })
    }
}

module.exports = AuthMiddleware