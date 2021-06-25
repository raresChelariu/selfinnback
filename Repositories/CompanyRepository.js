const Db = require("./Db")

class CompanyRepository {
    static Register(email, password, denumire, cui, nr_reg_com, sediu_social) {
        return new Promise((resolve, reject) => {
                Db.Query({
                    sql: 'call Company_Register(?, ?, ?, ?, ?, ?)',
                    values: [email, password, denumire, cui, nr_reg_com, sediu_social]
                }).then(result => resolve(result[0][0]))
                    .catch(e => reject(e))
            }
        )
    }
}

module.exports = CompanyRepository