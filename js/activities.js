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
		"width": 500,
		"data": {
			"values": tweet_array
		},
		"mark": "bar",
		"encoding": {
			"y": { "field": "activityType", "type": "nominal", "sort": "-x", "title": "Activity Type" },
			"x": { "aggregate": "count", "type": "quantitative", "title": "Number of Posts" }
		}
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
	const threeActivitiesByAvgDistance = activitiesByAvgDistance.filter(a =>
		a == activitiesByPopularity[0] ||
		a == activitiesByPopularity[1] ||
		a == activitiesByPopularity[2]
	)
	document.getElementById("longestActivityType").innerText = threeActivitiesByAvgDistance[0]
	document.getElementById("shortestActivityType").innerText = threeActivitiesByAvgDistance.at(-1)

	const avgWeekendDistance = math.mean(tweet_array
		.filter(p => p.distance != 0 && (p.time.getDay() == 0 || p.time.getDay() == 6))
		.map(p => p.distance))

	const avgWeekdayDistance = math.mean(tweet_array
		.filter(p => p.distance != 0 && p.time.getDay() != 0 && p.time.getDay() != 6)
		.map(p => p.distance))

	document.getElementById("weekdayOrWeekendLonger").innerText = avgWeekendDistance > avgWeekdayDistance ? "weekends" : "weekdays"

	window.aggregateShown = false

	const activityDistanceSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distances by day of week for each of the three most popular activities.",
		"width": 500,
		"data": {
			"values": tweet_array
				.filter(p =>
					p.activityType == activitiesByPopularity[0] ||
					p.activityType == activitiesByPopularity[1] ||
					p.activityType == activitiesByPopularity[2]
				)
				.map(p => ({
					activityType: p.activityType,
					distance: p.distance,
					time: p.time
				}))
		},
		"mark": "point",
		"encoding": {
			"y": { "field": "distance", "type": "quantitative", "title": "Distance" },
			"x": { "field": "time", "timeUnit": "day", "type": "ordinal", "title": "Day of the Week" },
			"color": { "field": "activityType", "type": "nominal" },
		}
	};
	vegaEmbed('#distanceVis', activityDistanceSpec, { actions: false }).then(console.log);


	const activityDistanceAggregatedSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distances by day of week for each of the three most popular activities.",
		"width": 500,
		"data": {
			"values": tweet_array
				.filter(p =>
					p.activityType == activitiesByPopularity[0] ||
					p.activityType == activitiesByPopularity[1] ||
					p.activityType == activitiesByPopularity[2]
				)
				.map(p => ({
					activityType: p.activityType,
					distance: p.distance,
					dayOfWeek: p.time.getDay(),
				}))
		},
		"mark": "point",
		"encoding": {
			"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Distance" },
			"x": {
				"field": "dayOfWeek",
				"type": "ordinal",
				"title": "Day of the Week",
				"axis": { "labelExpr": `(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])[datum.label]` }
			},
			"color": { "field": "activityType", "type": "nominal" },
		}
	};
	document.getElementById("distanceVisAggregated").style = "display: none"
	vegaEmbed('#distanceVisAggregated', activityDistanceAggregatedSpec, { actions: false });

	document.getElementById("aggregate").addEventListener("click", () => {
		if (window.aggregateShown) {
			document.getElementById("distanceVisAggregated").style = "display: none"
			document.getElementById("distanceVis").style = ""
		} else {
			document.getElementById("distanceVis").style = "display: none"
			document.getElementById("distanceVisAggregated").style = ""
		}
		window.aggregateShown = !window.aggregateShown
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});