function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	const tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const activitiesByType = Object.groupBy(tweet_array, (t) => t.activityType)
	document.getElementById("numberActivities").innerText = Object.keys(activitiesByType).length
	const activitiesByPopularity = Object.entries(activitiesByType)
		.sort(([_, posts1], [__, posts2]) => posts2.length - posts1.length)
		.map(([activity, _]) => activity)
	document.getElementById("firstMost").innerText = activitiesByPopularity[0]
	document.getElementById("secondMost").innerText = activitiesByPopularity[1]
	document.getElementById("thirdMost").innerText = activitiesByPopularity[2]

	const activitiesByAvgDistance = Object.entries(activitiesByType)
		.filter(([_, posts]) => posts.some(p => p.distance != 0)) // filter out non-distance activities
		.sort(([_, posts1], [__, posts2]) =>
			math.mean(posts2.map(p => p.distance)) - math.mean(posts1.map(p => p.distance))
		)
		.map(([activity, _]) => activity)
	document.getElementById("longestActivityType").innerText = activitiesByAvgDistance[0]
	document.getElementById("shortestActivityType").innerText = activitiesByAvgDistance.at(-1)

	const avgWeekendDistance = math.mean(tweet_array
		.filter(p => p.distance != 0 && (p.time.getDay() == 0 || p.time.getDay() == 6))
		.map(p => p.distance))

	const avgWeekdayDistance = math.mean(tweet_array
		.filter(p => p.distance != 0 && p.time.getDay() != 0 && p.time.getDay() != 6)
		.map(p => p.distance))

	document.getElementById("weekdayOrWeekendLonger").innerText = avgWeekendDistance > avgWeekdayDistance ? "weekends" : "weekdays"
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});