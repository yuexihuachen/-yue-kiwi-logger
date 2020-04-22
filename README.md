# mango-logger

Quick and easy recording

---

## Install

```bash
$ npm i -D guozishu-mango-logger
```

## Usage

创建一个 Logger

```js
const Logger = require('mango-logger');
let logger = new Logger({
    dir: path.resolve(path.dirname('../')),
    file: `${utility.YYYYMMDD()}.log`
});
logger.error('error msg');
logger.info('info msg');
logger.warn('warn msg');
logger.debug(new Error('error msg'));

```

## License
[MIT](LICENSE)
