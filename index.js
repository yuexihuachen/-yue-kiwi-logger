const path = require('path');
const utility = require('utility');
const MangoLogger = require('./lib/logger');

class Logger extends MangoLogger {
    constructor(options) {
        super(options);
        if (!options.file || !options.dir) {
            options = {
                dir: path.resolve(path.dirname('../')),
                file: `${utility.YYYYMMDD()}.log`
            };
        }
    }
}

module.exports = Logger;