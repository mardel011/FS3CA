const express = require("express");
const app = express();

const mongoose = require("mongoose");
const EventRM1 = require("./model/eventRM1");
const EventRM2 = require("./model/eventRM2");
const chatHistoryRM1 = require("./model/chathistoryRM1");
const chatHistoryRM2 = require("./model/chathistoryRM2");

const connectionString = "mongodb://shafinr:Pj8cAO8d9DJJQ8io@cluster0-shard-00-00-xljxs.mongodb.net:27017,cluster0-shard-00-01-xljxs.mongodb.net:27017,cluster0-shard-00-02-xljxs.mongodb.net:27017/ChatApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(connectionString, { useNewUrlParser: true } )
  .then( () => {console.log("Mongoose connected Successfully");},
  error => {console.log("Mongoose could not be connected to database: " + error);}
  );

//set the template engine ejs
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

//Listen on port 3001
const hostname = "127.0.0.1";
const port = 3001;

server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


// setup socket.io here

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection for room selection
io.on('connection', (socket) => {

//room1 button event handler
  socket.on("room1", () => {
      socket.join('defaultRoom')
      console.log("a user joined the default room")
      socket.emit("room1CommunicationWithClient") //will alert connection event, and change heading
      

//default username 
socket.username = "Anonymous";
    
var connectionHistoryRM1 = new EventRM1({
  eventType : "Connection Room 1",
  username: socket.username,
  date: Date()
})

connectionHistoryRM1.save((error, connectionHistoryRM1) => {
  if(error) console.log(`Error occured on connectionHistory.save(): ${error}`)
  else {
    console.log(`connectionHistoryRM1: connection saved: ${connectionHistoryRM1}`)
  }
})


//listen on change_username
socket.on('change_username', (data) => { //this 'change_username' is in chat.js

socket.username = data.username

var usernameHistoryRM1 = new EventRM1({
  eventType: "Username Change",
  username: socket.username,
  date: Date()
})

usernameHistoryRM1.save((error, usernameHistoryRM1) => {
  if(error) console.log(`Error occured on usernameHistory.save(): ${error}`)
  else {
    console.log(`usernameHistoryRM1: name to be saved: ${usernameHistoryRM1}`);
  }
})
})

//Listen on Query functions
socket.on('queryChatHistory', () => {
chatHistoryRM1.find((error, document) => {
    if (error) console.log(`Error on chatHistoryRM1.find(): ${error}`);
    else {
      console.log(`All Past messages: ${document}`)

      const data = document.map((x) => x);
      console.log(data)
    }
})
})

socket.on('queryEventHistory', () => {
EventRM1.find((error, document) => {
  if (error) console.log(`Error on Event.find(): ${error}`);
  else {
    console.log(`All Past Events: ${document}`)

    const data = document.map((x) => x);
    console.log(data)
  }
})
})

//listen on new_message
socket.on('new_message', (data) => { //this 'new_message' is in chat.js
 //broadcast the new message | below line is commented out to be replaced by room message emitter
 io.sockets.to("defaultRoom").emit('new_message', {message : data.message, username: socket.username});

 var messageHistoryRM1 = new chatHistoryRM1({
  username: socket.username,
  message: data.message,
  date: Date()
})
 
messageHistoryRM1.save((error, messageHistoryRM1) => {
   if (error) console.log(`Error Occured on messageHistoryRM1.save(): ${error}`)
   else {
     console.log(`messageHistoryRM1 messages to be saved: ${messageHistoryRM1}`);
   }
 }) 
}),  

//added event handler for disconnect event
socket.on('disconnect', (data) => {
username = socket.username;
console.log(`${username} disconnected`);

var disconnectionHistoryRM1 = new EventRM1({
  eventType: "Disconnection",
  username: socket.username,
  date: Date()
})

disconnectionHistoryRM1.save((error, disconnectionHistoryRM1) => {
  if (error) console.log(`Error Occured on disconnectionHistoryRM1.save(): ${error}`)
  else {
    console.log(`disconnectionHistoryRM1 event to be saved: ${disconnectionHistoryRM1}`);
  }
})
})

  })

  socket.on("room2", () => {
      socket.join('alternativeRoom')
      console.log("a user joined the alternative room")
      socket.emit("room2CommunicationWithClient") //will alert connection event, and change heading

      //default username 
socket.username = "Anonymous";
    
var connectionHistoryRM2 = new EventRM2({
  eventType : "Connection Room 2",
  username: socket.username,
  date: Date()
})

connectionHistoryRM2.save((error, connectionHistoryRM2) => {
  if(error) console.log(`Error occured on connectionHistoryRM2.save(): ${error}`)
  else {
    console.log(`connectionHistoryRM2: connection saved: ${connectionHistoryRM2}`)
  }
})


//listen on change_username
socket.on('change_username', (data) => { //this 'change_username' is in chat.js

socket.username = data.username

var usernameHistoryRM2 = new EventRM2({
  eventType: "Username Change",
  username: socket.username,
  date: Date()
})

usernameHistoryRM2.save((error, usernameHistoryRM2) => {
  if(error) console.log(`Error occured on usernameHistoryRM2.save(): ${error}`)
  else {
    console.log(`usernameHistoryRM2: name to be saved: ${usernameHistoryRM2}`);
  }
})
})

//Listen on Query functions
socket.on('queryChatHistory', () => {
chatHistoryRM2.find((error, document) => {
    if (error) console.log(`Error on chatHistoryRM2.find(): ${error}`);
    else {
      console.log(`All Past messages: ${document}`)

      const data = document.map((x) => x);
      console.log(data)
    }
})
})
socket.on('queryEventHistory', () => {
EventRM2.find((error, document) => {
  if (error) console.log(`Error on EventRM2.find(): ${error}`);
  else {
    console.log(`All Past Events: ${document}`)

    const data = document.map((x) => x);
    console.log(data)
  }
})
})

//listen on new_message
socket.on('new_message', (data) => { //this 'new_message' is in chat.js
 //broadcast the new message | below line is commented out to be replaced by room message emitter
 io.sockets.to("alternativeRoom").emit('new_message', {message : data.message, username: socket.username});

 var messageHistoryRM2 = new chatHistoryRM2({
  username: socket.username,
  message: data.message,
  date: Date()
})
 
messageHistoryRM2.save((error, messageHistoryRM2) => {
   if (error) console.log(`Error Occured on messageHistoryRM2.save(): ${error}`)
   else {
     console.log(`messageHistoryRM2 messages to be saved: ${messageHistoryRM2}`);
   }
 }) 
}),

//added event handler for disconnect event
socket.on('disconnect', (data) => {
username = socket.username;
console.log(`${username} disconnected`);

var disconnectionHistoryRM2 = new EventRM2({
  eventType: "Disconnection",
  username: socket.username,
  date: Date()
})

disconnectionHistoryRM2.save((error, disconnectionHistoryRM2) => {
  if (error) console.log(`Error Occured on disconnectionHistoryRM2.save(): ${error}`)
  else {
    console.log(`disconnectionHistoryRM2 messages to be saved: ${disconnectionHistoryRM2}`);
  }
})
})

})

})  