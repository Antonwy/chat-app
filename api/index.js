 const express = require('express')

 const router = express.Router();

const users = require('./users/users');

const chats = require('./chats/chats');

router.get('/', (req, res) => {
    res.send("You found the API");
})

router.use('/users', users)

router.use('/chats', chats)

module.exports = router;