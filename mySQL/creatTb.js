var mysql = require("mysql");
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mangcambien'
});

let listsensors = `CREATE TABLE listsensors(
id int auto_increment primary key,
name varchar(255),
mac_address varchar(255),
created_at timestamp);`;

con.query(listsensors, function (error, _results) {
  if (error) throw error;
  console.log("Table1 created");
});
let insertDataT1 = `INSERT INTO listsensors(name,mac_address) VALUES?`;
let values = [
  ["PTIT1", "AA11BB"],
  ["PTIT2", "DA29HH"],
  ["PTIT3", "ET55KL"],
  ["PTIT4", "CC98IK"],
  ["PTIT5", "DA18NM"],
];

con.query(insertDataT1, [values], (error, _results) => {
  if (error) return console.log(error);
  else console.log("INSERTED-T1");
});
let dulieucambien = `CREATE TABLE dulieucambien(
  id int auto_increment primary key,
  id_cambien int (10),
  tmp int(10),
  humi int(10),
  light int(10),
  created_at timestamp
  );`;
con.query(dulieucambien, function (error, _results) {
  if (error) throw error;
  console.log("Table2 created");
});

