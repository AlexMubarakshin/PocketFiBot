
/**
 * Parse the environment variables to get the accounts (useragents and raw data)
 * 
 * Example:
 * ACCOUNT_1_USER_AGENT=Mozilla/5.0 (...)
 * ACCOUNT_1_TG_RAW_DATA=query_id=1234&user=...
 * 
 * ACCOUNT_2_USER_AGENT=Mozilla/5.0 (...)
 * ACCOUNT_2_TG_RAW_DATA=query_id=2345&user=...
 * 
 * @param {*} envs = proccess.env
 * 
 * @returns {Array} - Array of accounts
 */
function parseEnvAccounts(envs) {
  const accountRegex = /^(ACCOUNT_\d)+_(\S+)/;
  const accounts = {};

  for (const key in envs) {
    if (accountRegex.test(key)) {
      const [_, account, type] = key.match(accountRegex);
      const value = envs[key];

      if (!accounts[account]) {
        accounts[account] = {};
      }

      accounts[account][type] = value;
    }
  }

  return Object.entries(accounts);
}

/**
 * 
 * Parse the environment variable to get the timeouts for the continuous mode
 * 
 * @param {*} envs proccess.env
 * @returns {Array|undefined} - Array of timeouts
 */
function parseContiniousModeTimeouts(envs) {
  const parsedTimeouts = envs.CONTINUOUS_RUN_MODE_TIMEOUT_MINS;
  if (!parsedTimeouts) {
    return undefined;
  }

  const timeouts = parsedTimeouts.split(",").map(Number);

  if (timeouts.some(isNaN)) {
    return undefined;
  }

  return timeouts;
}


/**
 *  Filter the valid accounts with useragent and raw data
 * 
 * @param {Array} accounts - Array of accounts
 * 
 * @returns {Array} - Array of valid accounts
 */
function filterValidAccounts(accounts) {
  return accounts.reduce((acc, [NAME, { USER_AGENT, TG_RAW_DATA }]) => {
    if (NAME && USER_AGENT && TG_RAW_DATA) {
      return [...acc, { NAME, USER_AGENT, TG_RAW_DATA }];
    }

    return acc;
  }, []);
}

function parseApplicationEnvs() {
  const REFFERER_URL = process.env.REFFERER_URL || "https://pocketfi.app/";
  const API_ROOT_URL = process.env.API_ROOT_URL || "https://bot.pocketfi.org";
  const MIN_MINING_AMOUNT = Number(process.env.MIN_MINING_AMOUNT || 0.25);
  const SHOW_LOGS_MESSAGES = process.env.SHOW_LOGS_MESSAGES !== undefined ?
    Boolean(Number(process.env.SHOW_LOGS_MESSAGES))
    : true;

  const CONTINUOUS_RUN_MODE = process.env.CONTINUOUS_RUN_MODE === '1';
  const CONTINUOUS_RUN_MODE_TIMEOUT_MINS = parseContiniousModeTimeouts(process.env) || [20, 30];

  const accounts = parseEnvAccounts(process.env);

  return {
    ACCOUNTS: filterValidAccounts(accounts),
    REFFERER_URL,
    API_ROOT_URL,
    MIN_MINING_AMOUNT,
    SHOW_LOGS_MESSAGES,
    CONTINUOUS_RUN_MODE,
    CONTINUOUS_RUN_MODE_TIMEOUT_MINS,
  };
}

module.exports = parseApplicationEnvs;
