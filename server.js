import express    from 'express';
import http       from 'http';
import bodyParser from 'body-parser';
import path       from 'path';
import url        from 'url';
import WebSocket  from 'ws';

import Logger            from './server/Console';
//import AmazonDashService from './server/AmazonDashService';
import DummyService      from './server/DummyService';
import SlackService      from './server/SlackService';
import TwitterService    from './server/TwitterService';

const PRIVATE_SETTING = './private.json';
const RUN_DUMMY = false;

let send = (type, message, option = {}) => {
  wss.clients.forEach((c) => {
    c.readyState === WebSocket.OPEN && c.send(
      JSON.stringify(
        Object.assign({}, { type, message }, option)
      )
    );
  });
};

const MSG_TYPE = {
  SYSTEM  : 1,
  SLACK   : 2,
  TWITTER : 3,
  DASH_BTN: 4
};

Logger.server('Start ...');

new Promise((resolve) => {
  Logger.server('Load config ...');
  resolve(require(PRIVATE_SETTING));
})
.then(config => {
  Logger.server('Ready ExpressJS server ...');

  const app = express();
  const port = process.env.PORT || 3000

  app.use(express.static(path.join(__dirname, 'client/public')))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json());

  const server = http.createServer(app);

  // WebSocket Server.
  const wss = new WebSocket.Server({ server });

  // SlackBot Client.
  const slack = new SlackService(
    config.slack.token,
    {
      connect: () => {
        Logger.server('Slack ... OK!');
        send(MSG_TYPE.SYSTEM, 'Slack Connected!', { status: { slack: true } });
      },
      message: msg => {
        send(MSG_TYPE.SLACK, msg);
      }
    }
  );

  // Twitter Client.
  const twitter = new TwitterService(
    config.twitter.authentication,
    config.twitter.track,
    {
      connect: () => {
        Logger.server('Twitter ... OK!');
        send(MSG_TYPE.SYSTEM, 'TWITTER OK!', { status: { twitter: true } });
      },
      message: tweet => {
        send(MSG_TYPE.TWITTER, tweet);
      },
      error  : err => {
        send(MSG_TYPE.SYSTEM, err);
      }
    }
  );

/*
  const dasher = new AmazonDashService(
    config.dash_button,
    {
      message: msg => send(MSG_TYPE.DASH_BTN, msg)
    }
  );
*/
  wss.on('connection', (ws, req) => {
    ws.on('message', msg => {
      Logger.client('received: %s', msg);
    });

    Logger.client('Joinned!');

    ws.send(JSON.stringify({
      type   : MSG_TYPE.SYSTEM,
      message: 'WebSocket Connected!',
      status : {
        slack  : slack.status,
        twitter: twitter.status
      }
    }));
  });

  // send 関数を上書き
  send = (type, message, option = {}) => {
    wss.clients.forEach((c) => {
      c.readyState === WebSocket.OPEN && c.send(
        JSON.stringify(
          Object.assign({}, { type, message }, option)
        )
      );
    });
  };

  server.listen(port, () => {
    Logger.server('Listening on ' + port);
  });

  Logger.server('Start Each services.');

  slack.start();
  twitter.start();

  return config;
})
.then((config) => {
  if (RUN_DUMMY) {
    const dummy = new DummyService(
      config.dummy,
      {
        message: (msg) => {
          send(msg.type, msg.message);
        }
      }
    );

    dummy.start();
  }
})
.catch(err => {
  Logger.error('Cannot run the server.');
  Logger.error(err);
});

