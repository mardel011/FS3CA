$(function(){
//make connection
var socket = io.connect('http://localhost:3001')


    //buttons and inputs
    var message = $("#message")
    var username = $('#username')
    var send_message = $('#send_message')
    var send_username = $('#send_username')
    var feedback = $("#feedback")
    var chatHistory = $("#chatHistory")
    var eventHistory = $("#eventHistory")
    var chatroom = $("#chatroom")
    var defaultRoom = $("#1")
    var alternativeRoom = $("#2")
    var roomTitle = $("#roomTitle")

    //Room Buttons
    defaultRoom.click(() => {
        socket.emit("room1")
        document.getElementById(defaultRoom).style.display = 'none';
        document.getElementById(alternativeRoom).style.display = '';
    })

    alternativeRoom.click(() => {
        socket.emit("room2")
        document.getElementById(alternativeRoom).style.display = 'none';
        document.getElementById(defaultRoom).style.display = '';
    })

    //room communication with client
    socket.on("room1CommunicationWithClient", () => {
        alert('Default Room Selected')
        roomTitle.text("Default Room")
    })

    socket.on("room2CommunicationWithClient", () => {
        alert('Alternative Room Selected')
        roomTitle.text("Alternative Room")
    })
 

    //Query Buttons
    chatHistory.click(function(){
        socket.emit('queryChatHistory')
    })
    eventHistory.click(function(){
        socket.emit('queryEventHistory')
    })

    //Emit message
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    })

    //Listen on new_new message
    socket.on("new_message", (data) => {
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })

    //Emit a username
    send_username.click(function(){
        console.log(username.val())
        socket.emit('change_username', {username : username.val()})
    })

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    })
})