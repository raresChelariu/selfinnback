// noinspection DuplicatedCode

const express = require('express')
const AuthMiddleware = require('./../Middleware/AuthMiddleware')
const DbError = require("../Repositories/DbError");
const ClientRepository = require("../Repositories/ClientRepository");
const {checkSchema} = require('express-validator')
const router = express.Router()

const ValidationSchemas = {
    Register: checkSchema({
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
        },
        prenume: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 128}
        },
        nume_familie: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 64}
        },
        cnp: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 14}
        },
        serie_buletin: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 10}
        }
    })
}

router.use(express.json())

router.post('/register',
    ValidationSchemas.Register,
    (req, res) => {
        ClientRepository.Register(req.body.email, req.body.parola, req.body.prenume, req.body.nume_familie, req.body.cnp, req.body.serie_buletin)
            .then(result => {
                let user = result[0][0]
                let token = AuthMiddleware.generateToken(user)
                res.send({
                    user: user,
                    token: token
                })
            })
            .catch(e => res.send({
                error: DbError.message(e)
            }))
    }
)


module.exports = router