'use strict';

const os = require('os');
const util = require('util');
const utility = require('utility');
const process = require('process');
const hostname = os.hostname();

/**
 * @class LoggerUtils
 */
module.exports = {
  format(level, args, meta) {
    meta = meta || {};
    let message=util.format.apply(util, args);
    let output;
    meta.level = level;
    meta.date = utility.logDate(',');
    meta.pid = process.pid;
    meta.hostname = hostname;
    meta.message = message;
    output = JSON.stringify(meta);
    output += os.EOL;
    return output;
  }
};


