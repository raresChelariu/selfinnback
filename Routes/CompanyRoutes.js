const express = require('express')
const AuthMiddleware = require('./../Middleware/AuthMiddleware')
const DbError = require("../Repositories/DbError")
const CompanyRepository = require("../Repositories/CompanyRepository")
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
        denumire: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 128}
        },
        cui: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 64}
        },
        nr_reg_com: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 14}
        },
        sediu_social: {
            in: ['body'],
            errorMessage: 'Invalid first_name',
            isLength: {min: 3, max: 10}
        }
    })
}

router.use(express.json())

router.post('/register',
    ValidationSchemas.Register.run,
    (req, res) => {
        CompanyRepository.Register(req.body.email, req.body.parola, req.body.denumire, req.body.cui, req.body.nr_reg_com,
            req.body.sediu_social)
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
    }
)


module.exports = router