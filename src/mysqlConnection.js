let mysql = require('mysql');
let connection = mysql.createConnection({
    connectionLimit: 100,
    host: 'db4free.net',
    user: 'user6to',
    password: '12345678',
    port: 3306,
    database: 'app6to'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;