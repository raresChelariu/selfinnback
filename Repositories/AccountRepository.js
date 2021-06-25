const Db = require('./Db')

class AccountRepository {
    static Login(email, password) {
        return new Promise((resolve, reject) => {
            Db.Query({
                sql: 'call Accounts_Login(?, ?)',
                values: [email, password]
            }).then(result => resolve(result[0][0]))
                .catch(e => reject(e))
            }
        )
    }
}

module.exports = AccountRepository