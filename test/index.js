const Koa = require('koa');
const path = require('path');
const utility = require('utility');
const Logger = require('../index.js');
const app = new Koa();

/**
 * error
 * warn
 * info
 * debug 
 */
app.use(async (ctx, next) => {
  let logger = new Logger({
    dir: path.resolve(path.dirname('../')),
    file: `${utility.YYYYMMDD()}.log`
  });
  ctx.logger=logger;
  ctx.body='logger';
  ctx.logger.error('error msg');
  ctx.logger.info('info msg');
  ctx.logger.warn('warn msg');
  ctx.logger.debug('debug msg');
  await next();
});

app.listen(3000);
console.log('http://localhost:3000/');
