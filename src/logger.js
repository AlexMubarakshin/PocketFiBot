const constants = require('./constants');

const COLORS = {
  APP_PREFIX: '\x1b[35m',
  DATE: '\x1b[36m',
  INFO: '\x1b[32m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
  DEFAULT: '\x1b[30m',
  BOLD_START: '\x1b[1m',
  BOLD_END: '\x1b[22m',
  WHITE: '\x1b[37m'
};

/**
 * Create a logger
 * 
 * @param {'DARK' | 'LIGHT'} paletteVariant 
 * @returns {Object} - Logger
 */
function createLogger(paletteVariant) {
  const textColor = paletteVariant === 'DARK' ? COLORS.WHITE : COLORS.DEFAULT;

  const Logger = {
    _appPrefix: `${COLORS.APP_PREFIX}[${constants.APPLICATION_NAME}]${textColor}`,
    _dateColor: COLORS.DATE,
    _colorizeLevel: (level) => {
      const COLOR_BY_LEVEL = {
        info: COLORS.INFO,
        warn: COLORS.WARN,
        error: COLORS.ERROR,
      };

      return COLOR_BY_LEVEL[level] || textColor;
    },
    _formatMessage: (level, message) => {
      const date = new Date();
      const dayFormatted = date.toLocaleDateString();
      const timeFormatted = date.toLocaleTimeString();
      const levelColored = Logger._colorizeLevel(level);
      const space = ' '.repeat(5 - level.length);
      const logDate = `${Logger._dateColor}${dayFormatted} ${timeFormatted}${textColor}`;
      const logLevel = `${levelColored}${level.toUpperCase()}${space}${textColor}`;

      return [
        Logger._appPrefix,
        logDate,
        logLevel,
        message
      ].join(' | ');
    },
    formatters: {
      makeBold: (message) => {
        return `${COLORS.BOLD_START}${message}${COLORS.BOLD_END}`;
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

  return Logger;
}

module.exports = createLogger;