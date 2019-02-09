const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const cors = require('cors')

const api = require('./api')

const db = require('./db')

const Chat = require('./api/Models/Chat');

app.use(express.json());
app.use(cors({
    exposedHeaders: 'x-auth',
}));

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/', api)

io.on('connection', (socket) => {
    console.log("New connection!");

    socket.on("createMessage", (id, from, text) => {
        Chat.findById(id).then(chat => {
            chat.newMessage(from, text).then(message => {
                io.to(id).emit("newMessage", message)
            })
        })
    })

    socket.on("joinRoom", (room) => {
        console.log("Joining room: ", room)
        socket.join(room);
    })

    socket.on('disconnect', () => {
        console.log("User disconnected.")
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log("Listen on port " + port)
})