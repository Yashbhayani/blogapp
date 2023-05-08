const mongoose = require("mongoose");
const d = new Date();

const userSchema = new mongoose.Schema({
    surname: {
        type: String, require: true
    },
    Firstname: {
        type: String, require: true
    },
    Lastname: {
        type: String, require: true
    },
    Email: {
        type: String, require: true
    },
    Mobile: {
        type: String, require: true
    },
    Birthdate: {
        type: String, require: true
    },
    Password: {
        type: String, require: true
    },
    Gender: {
        type: String, require: true
    },
    BlogPost: {
        type: Number, require: true
    },
    Date: {
        type: String, require: true
    },
    Startyear: {
        type: Number, require: true
    },
    Startmonth: {
        type: Number, require: true
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("User", userSchema);