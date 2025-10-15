function toPercent(num, precision = 0) {
	return math.format(num * 100, { notation: "fixed", precision }) + "%"
}

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

	const completedEvents = tweet_array.filter(t => t.source == "completed_event")
	const liveEvents = tweet_array.filter(t => t.source == "live_event")
	const achievements = tweet_array.filter(t => t.source == "achievement")
	const miscellaneous = tweet_array.filter(t => t.source == "miscellaneous")
	for (const e of document.getElementsByClassName("completedEvents")) {
		e.innerText = completedEvents.length
	}
	document.getElementsByClassName("completedEventsPct")[0].innerText = toPercent(completedEvents.length / tweet_array.length)
	document.getElementsByClassName("liveEvents")[0].innerText = liveEvents.length
	document.getElementsByClassName("liveEventsPct")[0].innerText = toPercent(liveEvents.length / tweet_array.length)
	document.getElementsByClassName("achievements")[0].innerText = achievements.length
	document.getElementsByClassName("achievementsPct")[0].innerText = toPercent(achievements.length / tweet_array.length)
	document.getElementsByClassName("miscellaneous")[0].innerText = miscellaneous.length
	document.getElementsByClassName("miscellaneousPct")[0].innerText = toPercent(miscellaneous.length / tweet_array.length)

	const written = tweet_array.filter(t => t.written)
	document.getElementsByClassName("written")[0].innerText = written.length
	document.getElementsByClassName("writtenPct")[0].innerText = toPercent(written.length / tweet_array.length, 2)

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});