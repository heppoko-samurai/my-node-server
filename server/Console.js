const reset   = '\u001b[0m';

const black   = msg => console.log('\u001b[30m', msg, reset);
const red     = msg => console.log('\u001b[31m', msg, reset);
const green   = msg => console.log('\u001b[32m', msg, reset);
const yellow  = msg => console.log('\u001b[33m', msg, reset);
const blue    = msg => console.log('\u001b[34m', msg, reset);
const magenta = msg => console.log('\u001b[35m', msg, reset);
const cyan    = msg => console.log('\u001b[36m', msg, reset);
const white   = msg => console.log('\u001b[37m', msg, reset);

export default {
  server: msg => yellow(msg),
  client: msg => cyan(msg),
  error : msg => red(msg),
  log   : (color, msg) => {
    if (msg === undefined) {
      msg   = color;
      color = reset;
    }
    switch (color) {
      case 'black'  : black(msg);   break;
      case 'red'    : red(msg);     break;
      case 'green'  : green(msg);   break;
      case 'yellow' : yellow(msg);  break;
      case 'blue'   : blue(msg);    break;
      case 'magenta': magenta(msg); break;
      case 'cyan'   : cyan(msg);    break;
      case 'white'  :
      default:        white(msg);
    }
  },
};
