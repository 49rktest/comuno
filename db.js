const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '65.0.91.65',
    port: 3307,
    user: 'mysql',      // default in Laragon
    password: '01986847f703df146e88',      // usually empty in Laragon
    database: 'comuno'
});

connection.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL');
});

module.exports = connection;