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
    dir: path.resolve(path.dirname('../'),"log"),
    file: `${utility.YYYYMMDD()}.log`
  });
  ctx.logger=logger;
  ctx.body='logger';
  ctx.logger.error('error msg');
  ctx.logger.info("This operation has been blocked as a potential Cross-Site Request Forgery (CSRF). Please either specify a 'content-type' header (with a type that is not one of application/x-www-form-urlencoded, multipart/form-data, text/plain) or provide a non-empty value for one of the following headers: x-apollo-operation-name, apollo-require-preflight\n");
  ctx.logger.warn('warn msg');
  ctx.logger.debug('debug msg');
  await next();
});

app.listen(3000);
console.log('http://localhost:3000/');
