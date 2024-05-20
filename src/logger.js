const constants = require('./constants');

const Logger = {
  _appPrefix: `\x1b[35m[${constants.APPLICATION_NAME}]\x1b[30m`,
  _dateColor: '\x1b[36m',
  _colorizeLevel: (level) => {
    const COLOR_BY_LEVEL = {
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    };

    return COLOR_BY_LEVEL[level] || '\x1b[30m';
  },
  /**
   * Format the message with the current date and the log level
   * 
   * @param {"info" | "warn" | "error"} level - The log level
   * @param {*} message 
   * @returns 
   */
  _formatMessage: (level, message) => {
    const date = new Date();
    const dayFormatted = date.toLocaleDateString();
    const timeFormatted = date.toLocaleTimeString();
    const levelColored = Logger._colorizeLevel(level);
    const space = ' '.repeat(5 - level.length);

    return `${Logger._appPrefix} | ${Logger._dateColor}${dayFormatted} ${timeFormatted}\x1b[30m| ${levelColored}${level.toUpperCase()}${space}\x1b[30m | ${message}`;
  },
  formatters: {
    makeBold: (message) => {
      return `\x1b[1m${message}\x1b[22m`;
    },
  },
  info: (message) => {
    console.log(Logger._formatMessage('info', message));
  },
  error: (message) => {
    console.error(Logger._formatMessage('error', message));
  },
  warn: (message) => {
    console.warn(Logger._formatMessage('warn', message));
  }
};

module.exports = Logger;
