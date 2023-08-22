'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const utility = require('utility');
const process = require('process');
const utils = require('./utils');
/**
 * 记录日志
 */
class KiwiLogger {
  /**
   * @constructor
   * @options {Object} 
   */
  constructor(options) {
    this.options = options;
    if (!path.isAbsolute(this.options.file)) {
      this.options.file = path.join(this.options.dir, this.options.file);
    }
    this._stream = null;
    this.reload();
  }
  /**
   * 重新创建可写入数据的流
   */
  reload() {
    this._closeStream();
    this._stream = this._createStream();
  }

  /**
   * 记录日志
   * @param  {String} level - 日志类型
   * @param  {Array} args - 参数
   * @param  {Object} meta - 元数据
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
   * 关闭可写流
   */
  close() {
    this._closeStream();
  }

  /**
   * @deprecated
   * 流文件已被接收完
   */
  end() {
    this.close();
  }

  /**
   * 写入文件流
   * @param {Buffer|String} buf - 日志内容
   * @private
   */
  _write(buf) {
    this._stream.write(buf);
  }

  /**
   *  是否可写
   * @return {Boolean} writable
   */
  get writable() {
    return this._stream && !this._stream.closed && this._stream.writable;
  }

  /**
   * 创建一个可写流
   * @return {Stream} 返回一个可写流
   * @private
   */
  _createStream() {
    mkdirp.sync(path.dirname(this.options.file));
    const stream = fs.createWriteStream(this.options.file, { flags: 'a' });

    const onError = err => {
      console.error('%s ERROR %s [kiwi-logger] [%s] %s',
        utility.logDate(','), process.pid, this.options.file, err.stack);
      this.reload();
      console.warn('%s WARN %s [kiwi-logger] [%s] reloaded', utility.logDate(','), process.pid, this.options.file);
    };
    // only listen error once because stream will reload after error
    stream.once('error', onError);
    stream._onError = onError;
    return stream;
  }

  /**
   * 关闭可写流
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
  KiwiLogger.prototype[level] = function () {
    this.log(LEVEL, arguments);
  };
});

module.exports = KiwiLogger;
