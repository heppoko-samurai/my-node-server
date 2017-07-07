import { RtmClient, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import Logger from './Console';
import BaseService from './BaseService';

export default class SlackService extends BaseService {

  constructor(token, callbacks) {
    super(callbacks);
    this.rtm    = new RtmClient(token);
    this.status = false;

    const self = this;
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      Logger.server(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
      self.status = true;
      self.fire('connect');
    });
    
    this.rtm.on(RTM_EVENTS.MESSAGE, (msg) => {
      self.fire('message', msg);
    });
  }

  start() {
    this.rtm.start();
  }
}
