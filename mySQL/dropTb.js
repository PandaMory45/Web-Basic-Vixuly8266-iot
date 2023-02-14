var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mangcambien'
});

con.connect(function (err) {
  if (err) throw err;
  var sql = "DROP TABLE listsensors";
  con.query(sql, function (err, _result) {
    if (err) throw err;
    console.log("Table1 deleted");
  });


  if (err) throw err;
  var sql = "DROP TABLE dulieucambien";
  con.query(sql, function (err, _result) {
    if (err) throw err;
    console.log("Table2 deleted");
  });
});