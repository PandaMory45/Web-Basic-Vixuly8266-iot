//mqtt
const mqtt = require("mqtt");
var options = {
    host: "mqtt.wuys.me",
    port: 1883,
    username: "ntn",
    password: "12345678",
};

var client = mqtt.connect(options);
//MySQL
var mysql = require("mysql");
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mangcambien'
});

//creat server
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Socket } = require("dgram");
const { connect } = require("http");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});

// Sub Data
client.on("connect", () => {
    console.log("✅ Connected to MQTT Broker");
    client.subscribe("sensors", () => { //nhận data từ Client
      client.on("message", (topic, payload) => {
        let tmp = payload.toString().split(','); // Array
        
        data={
          temp:tmp[0],
          humi:tmp[1],
          light:tmp[2],
          updated_at: new Date().toLocaleString('vi-VN', {
                      hour12: false
        })
      };
        io.emit("sensors", data);
         // insert data on table 
        let sql = `INSERT INTO dulieucambien (id_cambien,tmp, humi, light) VALUES (${Math.floor(Math.random() * 4)+1},${data.temp}, ${data.humi}, ${data.light});`;
        con.query(sql, (error) => {
            if (error) throw error;
            console.log(` Them du lieu: ${tmp}`);
        
      });
    });
  });
});

//Button .ON  SERVER and PUB mqtt
io.on("connection", (socket) => {
    socket.on("DEVICE1", (arg) => { //nhận data từ server
      client.publish("DEVICE1", arg, (err) => { // Pub cho Client "o" or "1"
        if (err) console.log(err);
        else 
          console.log(`✅ LED1: ${arg == '0' ? 'Turned On' : 'Turned Off'}`);
  
      });
    });
  });
  
  io.on("connection", (socket) => {
    socket.on("DEVICE2", (arg) => {
      client.publish("DEVICE2", arg, (err) => {
        if (err) console.log(err);
        else console.log(`✅ LED2: ${arg == '0' ? 'ON' : 'OFF'}`);
      });
    });
  });