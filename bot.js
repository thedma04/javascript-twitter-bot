/*
  Goals:

  1. Connect to Twitter - FINISHED
  2. Run a search for a topic - FINISHED
  3. choose a random tweet from search results - FINISHED
  4. confirm the tweet is a new tweet
  5. post tweet on a twitter accout - FINISHED
    - need to grab more than 15 tweets to choose from - FINISHED
  6. run the code every x amount of mins
  7. figure out how to create a worker with nodejs on heroku
  8. FUTURE GOAL: add in sentiment analysis
*/

var Twitter = require('twitter');
var fs = require('fs');

var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

var possibleTweets = [];
var historic_tweets = [];

var twitter_bot_engine = function() {
  // make a search for the topic of choice
  client.get('search/tweets', {q: 'free coding resources', count: 150}, function(error, tweets, response) {
    // console.log(tweets);

    for(tweet in tweets.statuses){
      possibleTweets.push({
        'text' : tweets.statuses[tweet].text,
        'id' : tweets.statuses[tweet].id,
        'name' : tweets.statuses[tweet].user.name,
        'screen_name' : tweets.statuses[tweet].user.screen_name,
        'location' : tweets.statuses[tweet].user.location
        // 'url' : tweets.statuses[tweet].url
      });
      // console.log(possibleTweets);
    }

    // select a random tweet
    var random_element = Math.floor(Math.random() * possibleTweets.length) + 1;
    console.log(random_element);
    var selected_tweet = possibleTweets[random_element];

    console.log(selected_tweet.text);
    // if the random tweet isnt in historic tweets
      // push to historic tweets
      // tweet the selected tweet
    client.post('statuses/update', {status: selected_tweet.text}, function(error, tweet, response) {
      if (!error) {
        console.log(tweet);
      }
    });

    // this saves the tweet objects in a json file
    fs.writeFile('tweet_contents.json', possibleTweets, (err) => {
      if(err) throw err;
      // console.log(`this was a success!!`)
    })

    // this saves twitter files to a text file
    fs.writeFile('tweets.json', JSON.stringify(tweets, null, '\t'), (err) => {
     if(err) throw err;
    //  console.log(`...and It's saved!`);
    });

    // this creates a record of historic tweets in json
    fs.writeFile('historic_tweets.json', historic_tweets, (err) => {
      if(err) throw err;
      // console.log(`Like DJ Khalid says..... Another one!`);
    })
  });
}

twitter_bot_engine();
// setInterval(twitter_bot_engine, 1200000);
setInterval(twitter_bot_engine, 50000);
