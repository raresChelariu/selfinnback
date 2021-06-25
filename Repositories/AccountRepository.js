const Db = require('./Db')

class AccountRepository {
    static Login(email, password) {
        return Db.Query({
            sql: 'call Account_Login(?, ?)',
            values: [email, password]
        })
    }
}

module.exports = AccountRepository