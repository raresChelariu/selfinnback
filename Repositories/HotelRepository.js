const Db = require('./Db')

class HotelRepository {
    static Add(acc_id, denumire, descriere) {
        return new Promise((resolve, reject) => {
                Db.Query({
                    sql: 'call Hotel_Add(?, ?, ?)',
                    values: [acc_id, denumire, descriere]
                }).then(result => resolve(result))
                    .catch(e => reject(e))
            }
        )
    }

    static GetAll() {
        return Db.Query({
            sql: 'select * from hotels',
            values: []
        })
    }

    static GetHotelsOfCompany(company_ID) {
        return Db.Query({
            sql: 'select * from hotels where company_ID=?',
            values: [company_ID]
        })
    }
}

module.exports = HotelRepository