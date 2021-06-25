const Db = require('./Db')

class ClientRepository {
    static Register(email, password, prenume, nume_familie, cnp, serie_buletin) {
        return Db.Query({
            sql: 'call Client_Register(?, ?, ?, ?, ?, ?)',
            values: [email, password, prenume, nume_familie, cnp, serie_buletin]
        })
    }
}

module.exports = ClientRepository