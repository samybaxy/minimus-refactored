import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor( private http: HttpClient ) { }
  tweetsURL = 'https://us-central1-minimus-cloud.cloudfunctions.net/tweets';

  fetchTweets(city: string) {
    const data = {
      data: {
        q: `${city} Weather`
      }
    };

    const tweetFn = (tweet: any) => ({
      text: tweet.text,
      date: tweet.created_at,
      user: {
        name: tweet.user.name,
        photo: tweet.user.profile_image_url_https,
        handle: tweet.user.screen_name
      }
    });

    return this.http.post(this.tweetsURL, data)
      .pipe(
        first(),
        map((res: any) => {
          res && res.result ? res.result.statuses : []
        }),
        filter((tweets: any) => tweets.map(tweet => tweet.text && tweet.text.match(/weather/g))),
        map( (tweets: any) => {
          tweets.map(tweetFn(tweets))
        } ),
        map( (tweets: any) => tweets.slice(0, 4) )
      );
  }
}
