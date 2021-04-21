//backend comms bc were using node modules

const bayes = require('bayes');
const SW = require('stopword');
const fs = require('fs'); //to create filesystem to read classifier

//express application-  only backend
const express = require('express');
var app = express();

//create server
var server = app.listen(3000);

//have application use public folder stuff
app.use(express.static('public'));

var coolClassifier;
fs.readFile('./classifier.json', downloadedFile);

const alphanumeric = /^[0-9a-zA-Z]+$/;

function downloadedFile(error, data) { //error first function
    if (error) {
        console.log(error);
    } else {
        coolClassifier = bayes.fromJson(data);

        //dont want to start socket until read classifier
        io.sockets.on('connection', newConnection);  //params- ?, callback
    }
}

//creates and defines socket
var socket = require('socket.io');
var io = socket(server); //need to handle in and out data - param is server name

var response;

function newConnection(socket) {
    console.log("new connection! " + socket.id);

    socket.on('guess', guessMsg);

    async function guessMsg(data) {
        mlReadyData = cleanup(data);

        var category = await coolClassifier.categorize(mlReadyData); //await makes async

        if (category == 'music') {
            response = "Cool! My favorite artist is Adele. She ALWAYS gets me in the feels.";
        } else if (category == 'film') {
            response = "I'm a hugeee Marvel nerd TBH. Iron Man is my fave!";
        } else if (category == 'food') {
            response = "Breakfast foods over everything. I could eat waffles everyday for the rest of my life.";
        } else if (category == 'animals') {
            response = "OMG I have the cutest labrador retriever.";
        } else if (category == 'social media') {
            response = "I am addicted to TikTok no joke.";
        }

        //.emit- send to everyone and messenger; route name, data
        socket.emit('guess', response);
    }
}

function cleanup(tweet) {
    var temp_split_tweet = tweet.split(" "); //takes tweet and splits words into an array

    var temp_new_words = [];
    temp_split_tweet = SW.removeStopwords(temp_split_tweet); //removes stopwords from the tweet array and puts into new array

    //test if word only contains letters/num and if greater than 2 characters
    for (var i = 0; i < temp_split_tweet.length; i++) {
        if (alphanumeric.test(temp_split_tweet[i]) && temp_split_tweet[i].length > 2) {
            temp_new_words.push(temp_split_tweet[i].toLowerCase());
        }
    }
    //syntax for taking array and turning it into a set to get rid of duplicates; ... -> spread operator
    var uniq = [...new Set(temp_new_words)];
    var final_words = uniq.join(", "); //puts ,  in bw all keywords
    return final_words;
}