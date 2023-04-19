//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const SHA256 = require("crypto-js/sha256");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });


const userSchema = new mongoose.Schema ({
    email: String,
    password: {
        type: String,
        required: true
    }
});


const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/logout", function (req, res) {
    res.render("home");
});


app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: SHA256(req.body.password).toString()
    });

    newUser.save()
    .then(function() {
        res.render("secrets");
    })
    .catch(function(err) {
        console.log(err);
    });

});

app.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = SHA256(req.body.password).toString();

    try {
        const foundUser = await User.findOne({email: username}).exec();
        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        }
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, function () {
    console.log("Server started on port 3000.");
});
