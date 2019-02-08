const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true
    },
    email: {
        type: String, 
        required: true, 
        trim: true, 
        minlenght: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String, 
        required: true, 
        minlenght: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
})

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token})

    return user.save().then(doc => {
        return token;
    })   
}

UserSchema.methods.removeToken = function (token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findByName = function (name) {
    const User = this;

    return User.findOne({
        username: name
    })

}

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'username'])
}

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({email})
        .then(user => {
            if (!user) {
                Promise.reject();
            }
            return new Promise((resolve,  reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if(res) {
                        resolve(user)
                    }else {
                        reject();
                    }
                })
            })
        })

}

UserSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    }else {
        next();
    }

})

const User = mongoose.model('User', UserSchema);

module.exports = User;