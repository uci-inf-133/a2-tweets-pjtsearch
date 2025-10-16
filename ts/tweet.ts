class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
          return "completed_event"
        } else if (this.text.startsWith("Achieved")) {
          return "achievement"
        } else if (this.text.startsWith("Watch my") && this.text.includes("Runkeeper Live")) {
          return "live_event"
        } else {
          return "miscellaneous"
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.writtenText.length > 0
    }

    get writtenText():string {
      // The beginning text, then a dash, then the written text (group 1), then whitespace, then the t.co link then the hashtag(s)
      return this.text.match(/.* -\s(.*)\s+https:\/\/t\.co.+\s#.*/)?.[1] || ""
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        return (
          this.text.match(/Just \w+ a [\d\.]+ \w+ (\w+)/)?.[1] ||
          this.text.match(/Just \w+ a (.+) in [\d\.]+/)?.[1] ||
          "unknown"
        )
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        const distanceString = this.text.match(/Just \w+ a ([\d\.]+) (\w+) \w+/)
        if (!distanceString) {
          return 0
        }
        return distanceString[2] == "km" ? Number(distanceString[1]) * 1.069 : Number(distanceString[1])
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}