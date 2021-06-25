const express = require('express')
const AuthMiddleware = require('./../Middleware/AuthMiddleware')
const AccountRepository = require("../Repositories/AccountRepository");
const DbError = require("../Repositories/DbError");
const {checkSchema} = require("express-validator");
const router = express.Router()

router.use(express.json())
const ValidationSchemas = {
    Login: checkSchema({
        email: {
            in: ['body'],
            errorMessage: 'Invalid email',
            isEmail: true,
            isLength: {min: 5, max: 128}
        },
        parola: {
            in: ['body'],
            errorMessage: 'Invalid pass',
            isLength: {min: 5, max: 256}
        }
    })
}

router.post('/login',
    ValidationSchemas.Login.run,
    function (req, res) {
    AccountRepository.Login(req.body["email"], req.body["password"])
        .then(result => {
            let user = result[0]
            let token = AuthMiddleware.generateToken(user)
            res.send({
                user: user,
                token: token
            })
        })
        .catch(e => res.send({
            error: DbError.message(e)
        }))
})


module.exports = router