// noinspection HttpUrlsUsage

const express = require('express')
const AuthMiddleware = require("./Middleware/AuthMiddleware")
const IPAddressGetter = require("./ServerIPAddress");
const app = express()
const port = 3000

app.use('/accounts', require('./Routes/AccountRoutes'))
app.use('/clients', require('./Routes/ClientRoutes'))
app.use('/companies', require('./Routes/CompanyRoutes'))
app.use('/hotels', require('./Routes/HotelRoutes'))

app.get('/blabla',
    AuthMiddleware.Run,
    (req, res) => {
    res.send('auth works')
})

app.get('/', (req, res) => {
    res.send('all good')
})

app.listen(port, () => {
    console.log(`Selfinn server now listening at http://${IPAddressGetter.Get()}:${port}`)
})