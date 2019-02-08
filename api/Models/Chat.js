const mongoose = require('mongoose');
const _ = require('lodash');

const ChatSchema = mongoose.Schema({
    group: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        maxlength: 20,
        default: null
    },
    members: [{
        type: String,
        required: true
    }],
    messages: [{
        chatID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

ChatSchema.pre('save', function(next) {
    if (this.isNew) {
        if(this.members.length > 2){
            this.group = true;
            next();
        }else {
            next();
        }

    }else {
        next();
    }
})

ChatSchema.methods.newMessage = function(from, text) {
    const chat = this;

    chat.messages.push({
        from,
        text,
        chatID: chat._id
    })

    return chat.save()
}

// returns members if valid
ChatSchema.statics.validateChat = function(members) {

    const User = this.db.model('User');

    const promises = [];

    let valid = true;
    let uniqMembers = _.uniq(members);
    let data = {
        members: uniqMembers,
        group: uniqMembers.length > 2,
    }

    data.members.forEach(username => {
        promises.push(
            User.findByName(username)
                .then(res => {
                    if(res === null) {
                        valid=false;
                    }
                })
        )
    })

    return Promise.all(promises).then(() => {
        if(valid){
            return data
        }else {
            Promise.reject();
        }
    })
}

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;