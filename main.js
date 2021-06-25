const express = require('express')
const AuthMiddleware = require("./Middleware/AuthMiddleware")
const app = express()
const port = 3000

app.use('/accounts', require('./Routes/AccountRoutes'))
app.use('/clients', require('./Routes/ClientRoutes'))
app.use('/companies', require('./Routes/CompanyRoutes'))

app.get('/blabla', AuthMiddleware.Run,(req, res) => {
    res.send('auth works')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})