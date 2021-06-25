const Db = require('./Db')

class ClientRepository {
    static Register(email, password, prenume, nume_familie, cnp, serie_buletin) {
        return new Promise((resolve, reject) => {
                Db.Query({
                    sql: 'call Client_Register(?, ?, ?, ?, ?, ?)',
                    values: [email, password, prenume, nume_familie, cnp, serie_buletin]
                }).then(result => resolve(result[0][0]))
                    .catch(e => reject(e))
            }
        )
    }
}

module.exports = ClientRepository