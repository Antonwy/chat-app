const router = require('express').Router();

const User = require('../Models/User');

const {authenticate} = require('../middleware/authenticate')

router.get('/', authenticate, (req, res) => {
    res.send("GET ALL USER");
});

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.get('/all', authenticate, (req, res) => {
    User.find({}).then(allUser => {
        res.send(allUser);
    }).catch(err => {
        res.status(404).send();
    })
});

router.post('/register', (req, res) => {

    const {username, email, password} = req.body;

    const user = new User({
        username,
        email, 
        password
    })

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        if(e.code === 11000) {
            res.status(400).send();
        }else {
            res.status(404).send();
        }
    });
    
})

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    User.findByCredentials(email, password)
        .then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user);
            })
        })
        .catch(err => {
            res.status(400).send();
        })
});

router.delete('/logout', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})
  
  
router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

module.exports = router;