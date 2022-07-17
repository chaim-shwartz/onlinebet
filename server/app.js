const express = require("express");
const bodyparser = require("body-parser");
var cors = require('cors')
var socket= require('socket.io');
require('dotenv').config()




const app = express();
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(express.json())

app.get('/', function (req, res) {
    res.send("okkk")
})



let port = process.env.PORT;
console.log(process.env.PORT)
  if (port==null||port == "") {
    port = 8000;
  }

var server = app.listen(port, function () {
    console.log("app is running on port 8000")
  })

const io = socket(server, {
    cors: {
      origin: "https://main--auctionlive.netlify.app",
      // origin: "http://localhost:3000",
    }
  });

io.on('connection',function (socket) {
    // console.log("we arr connect!")
    socket.on('join',chatID=>{
      socket.join(chatID);
      socket.on('sendMsg', res=>{
        // console.log(res)
        io.to(chatID).emit('returnSendMsg',res)
      })
    })
    socket.on("disconnecting", () => {
      // console.log(socket.rooms); // the Set contains at least the socket ID
    });
    socket.on("disconnect", () => {
       // the Set contains at least the socket ID
    });
    
    
})