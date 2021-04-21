const Twit = require("twit");
const config = require("./config.js");
var T = new Twit(config);
var SW = require("stopword"); //stopwords are words irrelevant to topic ex. 'to','the'
var bayes = require('bayes');
var classifier = bayes();
var fs = require("fs");

const alphanumeric = /^[0-9a-zA-Z]+$/; //regular expression- only words w letters/nums

//using trending twitter words and associating them w categories
/* topics:
1. music
2. film
3. social medias
4. animals
5.food */
var trends = { 
    "director": "film",
    "actor": "film",
    "movie": "film",
    "film": "film",
    "actress": "film",
    "music": "music",
    "singer": "music",
    "song": "music",
    "album": "music",
    "tour": "music",
    "social media": "social media",
    "instagram": "social media",
    "facebook": "social media",
    "tiktok": "social media",
    "twitter": "social media",
    "animal": "animals",
    "dog": "animals",
    "cat": "animals",
    "pet": "animals",
    "bunny": "animals",
    "meal": "food",
    "breakfast": "food",
    "lunch": "food",
    "dinner": "food",
    "food": "food"
}

//iterates thru trends array
var index = 0;
for (let [key, value] of Object.entries(trends)) {

    //get instead of post bc getting twit data: where to get it- route, query search- num of tweets u get, callback function- if only called once, can define here
    T.get('search/tweets', { q: key, count: 100}, async function (err, data, response) {

        //try catch - try out code, if not working, print error
        try {

            for (var i = 0; i < data.statuses.length; i++) {
                var temp_tweet = data.statuses[i].text;

                var cleaned_up_words = cleanup(temp_tweet);
                await classifier.learn(cleaned_up_words, value); //makes it async function, which switches up syntax of error first function- makes it into try catch
            }

            index++;
            if (index == 25) {

                var stateJson = classifier.toJson();
                fs.writeFile("./classifier.json", stateJson, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("successfully saved the classifier");
                    }
                })
            }

        } catch (err) {
            console.log(err);
        }
    });
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