import Twitter from 'twitter';
import Logger from './Console';
import BaseService from './BaseService';
// Twitter ---------------------------------------------
// https://apps.twitter.com/app/13980656
// http://dotnsf.blog.jp/archives/1044796238.html
// https://dev.twitter.com/streaming/overview/request-parameters
//------------------------------------------------------

export default class TwitterService extends BaseService {

  constructor(options, track, callbacks) {
    super(callbacks);
    this.twitter = new Twitter(options);
    this.track   = track;
    this.status  = false;
  };

  start() {
    const self = this;

    this.twitter.stream(
      'statuses/filter',
      { track: this.track },
      stream => {
        stream.on('data', tweet => {
console.log(tweet);
          self.fire('message', tweet);
        });

        stream.on('error', error => {
          Logger.error(error.toString());
          self.fire('error', error);
        });

        self.status = true;
        self.fire('connect');
      }
    );
  }
}
