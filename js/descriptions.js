function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	window.writtenTweets = runkeeper_tweets.map((tweet) =>
		new Tweet(tweet.text, tweet.created_at)
	).filter(t => t.written);
	updateTable(document.getElementById("textFilter").value)
}

function addEventHandlerForSearch() {
	document.getElementById("textFilter").addEventListener("keyup", (event) =>
		updateTable(event.target.value)
	)
}

function updateTable(text) {
	document.getElementById("searchText").innerText = text
	const matchingTweets = window.writtenTweets
		.filter(tweet => tweet.writtenText.toLowerCase().includes(text.toLowerCase()))
	document.getElementById("searchCount").innerText = text == "" ? 0 : matchingTweets.length
	document.getElementById("tweetTable").innerHTML = text == "" ?
		"" : matchingTweets
			.map((tweet, i) =>
				tweet.getHTMLTableRow(i + 1)
			)
			.join("\n")
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});