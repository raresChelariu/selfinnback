const Db = require("./Db")

class CompanyRepository {
    static Register(email, password, denumire, cui, nr_reg_com, sediu_social) {
        return Db.Query({
            sql: 'call Company_Register(?, ?, ?, ?, ?, ?)',
            values: [email, password, denumire, cui, nr_reg_com, sediu_social]
        })
    }
}
module.exports = CompanyRepository