class DbError {
    static message(e) {
        let msg = e.toString()
        if (-1 === msg.indexOf('$'))
            return msg;
        return msg.substring(msg.indexOf('$') + 1, msg.lastIndexOf('$'))
    }
}
module.exports = DbError