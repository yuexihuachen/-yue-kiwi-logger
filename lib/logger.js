'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const utility = require('utility');
const process = require('process');
const utils = require('./utils');
/**
 * output log
 */
class MangoLogger {
  /**
   * @constructor
   * @param {Object} 
   */
  constructor(options) {
    this.options = options;
    if (!path.isAbsolute(this.options.file)) this.options.file = path.join(this.options.dir, this.options.file);
    this._stream = null;
    this.reload();
  }
  /**
   * reload file stream
   */
  reload() {
    this._closeStream();
    this._stream = this._createStream();
  }

  /**
   * output log
   * @param  {String} level - log level
   * @param  {Array} args - all arguments
   * @param  {Object} meta - meta information
   */
  log(level, args, meta) {
    if (!this.writable) {
      const err = new Error(`log stream had been closed`);
      console.error(err.stack);
      return;
    }
    const buf = utils.format(level, args, meta, this.options);
    if (buf.length) {
      this._write(buf);
    }
  }

  /**
   * close stream
   */
  close() {
    this._closeStream();
  }

  /**
   * @deprecated
   */
  end() {
    this.close();
  }

  /**
   * write stream directly
   * @param {Buffer|String} buf - log content
   * @private
   */
  _write(buf) {
    this._stream.write(buf);
  }

  /**
   *  is writable
   * @return {Boolean} writable
   */
  get writable() {
    return this._stream && !this._stream.closed && this._stream.writable;
  }

  /**
   * create stream
   * @return {Stream} return writeStream
   * @private
   */
  _createStream() {
    mkdirp.sync(path.dirname(this.options.file));
    const stream = fs.createWriteStream(this.options.file, { flags: 'a' });

    const onError = err => {
      console.error('%s ERROR %s [mango-logger] [%s] %s',
        utility.logDate(','), process.pid, this.options.file, err.stack);
      this.reload();
      console.warn('%s WARN %s [mango-logger] [%s] reloaded', utility.logDate(','), process.pid, this.options.file);
    };
    // only listen error once because stream will reload after error
    stream.once('error', onError);
    stream._onError = onError;
    return stream;
  }

  /**
   * close stream
   * @private
   */
  _closeStream() {
    if (this._stream) {
      this._stream.end();
      this._stream.removeListener('error', this._stream._onError);
      this._stream = null;
    }
  }
}

['error', 'warn', 'info', 'debug'].forEach(level => {
  const LEVEL = level.toUpperCase();
  MangoLogger.prototype[level] = function () {
    this.log(LEVEL, arguments);
  };
});

module.exports = MangoLogger;
