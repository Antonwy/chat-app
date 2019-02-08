const router = require('express').Router();

const Chat = require('../Models/Chat');

const {authenticate} = require('../middleware/authenticate');

// returns all your chats
// finds user with the JWT
router.get('/', authenticate, (req, res) => {
    Chat.find({
        'members': req.user.username
    })
    .then(chat => {
        res.send(chat);
    })
});

// should include:
// array of members: ["test", "test"]
// if group, must include name
router.post('/new', authenticate, (req, res) => {

    const {members} = req.body;

    const chat = new Chat({
        members: [...members, req.user.username]
    })

    Chat.validateChat(chat.members)
        .then(data => {
            chat.members = data.members;

            if(data.group && req.body.name) {
                chat.name = req.body.name;
            }else if(data.group && !req.body.groupName) {
                return res.status(400).send("No name included!");
            }
            chat.save().then(chat => {
                res.send(chat);
            })
            .catch(err => res.status(404).send(err))
        })
        .catch(err => {
            res.status(404).send();
        })
})

module.exports = router;