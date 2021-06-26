const jwt = require('jsonwebtoken')

class AuthMiddleware {
    static #TOKEN_SECRET = require('crypto').createHash('sha256').update('ANDY-JWT-SECRET', 'binary').digest('hex')
    static #Account_Types = {
        Company: 'company',
        Client: 'client'
    }
    static Run(req, res, next) {
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
    static RunCompanyAuth(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, AuthMiddleware.#TOKEN_SECRET, (err, user) => {
            console.log(err)

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
        if (req.user["account_type"] !== AuthMiddleware.#Account_Types.Company)
            return res.sendStatus(403)
    }
    static RunClientAuth(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, AuthMiddleware.#TOKEN_SECRET, (err, user) => {
            console.log(err)

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
        if (req.user["account_type"] !== AuthMiddleware.#Account_Types.Client)
            return res.sendStatus(403)
    }
    static generateToken(payload) {
        return jwt.sign(payload, AuthMiddleware.#TOKEN_SECRET, { expiresIn: '7200s' })
    }
}

module.exports = AuthMiddleware