function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	const tweetDates = tweet_array.map(t => t.time);
	document.getElementById("firstDate").innerText = tweetDates.reduce((date, min) => date < min ? date : min).toLocaleDateString()
	document.getElementById("lastDate").innerText = tweetDates.reduce((date, max) => date > max ? date : max).toLocaleDateString()
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});