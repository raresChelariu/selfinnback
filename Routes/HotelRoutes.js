// noinspection JSCheckFunctionSignatures

const express = require('express')
const AuthMiddleware = require('./../Middleware/AuthMiddleware')
const DbError = require("../Repositories/DbError")
const HotelRepository = require("../Repositories/HotelRepository")
const {checkSchema} = require('express-validator')
const router = express.Router()

const ValidationSchemas = {
    AddHotel: checkSchema({
        denumire: {
            in: ['body'],
            errorMessage: 'Parametru invalid - denumire',
            isLength: {min: 3, max: 128}
        },
        descriere: {
            in: ['body'],
            errorMessage: 'Parametru invalid - descriere',
            isLength: {min: 3, max: 128}
        }
    }),
    GetHotelsOfCompany: checkSchema({
        company_id: {
            in: ['params'],
            errorMessage: 'Parametru invalid - company_id',
            isInt: true
        }
    })
}

router.use(express.json())

router.post('/',
    AuthMiddleware.RunCompanyAuth,
    ValidationSchemas.AddHotel,
    (req, res) => {
        HotelRepository.Add(req.user["ID"], req.body.denumire, req.body.descriere)
            .then((result) => {
                console.log(result)
                res.sendStatus(201)
                res.end()
            })
            .catch(e => res.send({
                error: DbError.message(e)
            }))
    })

router.get('/',
    AuthMiddleware.Run,
    (req, res) => {
        HotelRepository.GetAll()
            .then(result => res.send(result))
            .catch(e => res.send({
                error: DbError.message(e)
            }))
    })

router.get('/companies/:company_id',
    AuthMiddleware.Run,
    ValidationSchemas.GetHotelsOfCompany,
    (req, res) => {
        HotelRepository.GetHotelsOfCompany(req.params.company_id)
            .then(result => res.send(result))
            .catch(e => res.send({
                error: DbError.message(e)
            }))
    })



module.exports = router