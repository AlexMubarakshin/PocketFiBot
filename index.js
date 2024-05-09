const REFFERER_URL = process.env.REFFERER_URL || "https://pocketfi.app/";
const API_ROOT_URL = process.env.API_ROOT_URL || "https://bot.pocketfi.org";
const MIN_MINING_AMOUNT = Number(process.env.MIN_MINING_AMOUNT || 0.25);

const SHOW_LOGS_MESSAGES = process.env.SHOW_LOGS_MESSAGES !== undefined ?
  Boolean(Number(process.env.SHOW_LOGS_MESSAGES))
  : true;

function logProcessing(emoji, message, logLevel, showMessage) {
  const logMessage = showMessage ? message : '*****🕵️*****'
  const result = `${emoji}  ${logMessage}`;

  if (logLevel in console) {
    console[logLevel](result);
  } else {
    console.log(result);
  }
}

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

  return Object.entries(accounts)
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

/**
 * @param {Object} options - The options object.
 * @param {string} options.url - The URL to which the request is made.
 * @param {string} options.method - The HTTP method to be used for the request (e.g., 'GET', 'POST').
 * @param {Object} options.rawData - The raw data to be sent with the request body.
 * @param {string} options.userAgent - The User-Agent header for the request.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON response.
 * @throws {Error} If the request fails or the response status is not ok.
 */
async function makeRequest({ url, method, rawData, userAgent }) {
  const response = await fetch(url, {
    "cache": "default",
    "credentials": "omit",
    "headers": {
      "Accept": "*/*",
      "Accept-Language": "en-GB,en;q=0.9",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "telegramRawData": rawData,
      "User-Agent": userAgent
    },
    "method": method,
    "mode": "cors",
    "redirect": "follow",
    "referrer": REFFERER_URL,
    "referrerPolicy": "strict-origin-when-cross-origin"
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Calculate the mining amount
 * 
 * @param {Number} miningAmount 
 * @param {Number} dttmLastPayment 
 * @param {Number} speed 
 * @returns 
 */
function calculateMiningAmount(miningAmount, dttmLastPayment, speed) {
  const minutesSinceLastPayment = (Date.now() - dttmLastPayment) / 60_000;
  const miningAmountIncrease = Math.max(minutesSinceLastPayment * (speed / 60), 0);

  return miningAmount + miningAmountIncrease;
}

async function proccessAccount(account) {
  const { NAME, USER_AGENT, TG_RAW_DATA } = account;

  const { userMining: { miningAmount = 0, dttmLastPayment, speed } } = await makeRequest({
    url: `${API_ROOT_URL}/mining/getUserMining`,
    method: 'GET',
    rawData: TG_RAW_DATA,
    userAgent: USER_AGENT
  });

  const mined = calculateMiningAmount(miningAmount, dttmLastPayment, speed);

  logProcessing('⛏️', `[${NAME}] Mining amount: ${miningAmount}`, 'log', SHOW_LOGS_MESSAGES)

  if (mined < MIN_MINING_AMOUNT) {
    logProcessing('🫠', `[${NAME}] Cannot withdraw, mined amount is less than ${MIN_MINING_AMOUNT}`, 'log', SHOW_LOGS_MESSAGES)

    return;
  }

  try {
    const { userMining: { gotAmount } } = await makeRequest({
      url: `${API_ROOT_URL}/mining/claimMining`,
      method: 'POST',
      rawData: TG_RAW_DATA,
      userAgent: USER_AGENT
    });
    logProcessing('✅', `[${NAME}] Successfully claimed ${mined}`, 'log', SHOW_LOGS_MESSAGES)
    logProcessing('💰', `[${NAME}] Total amount: ${gotAmount}`, 'log', SHOW_LOGS_MESSAGES)
  } catch (error) {
    logProcessing('❌', `[${NAME}] Error while claiming: ${error.message}`, 'error', SHOW_LOGS_MESSAGES)
  }
}

async function main() {

  const accounts = filterValidAccounts(parseEnvAccounts(process.env));
  if (!accounts.length) {
    throw new Error(`No valid accounts found. Please check the environment variables.
Example:
ACCOUNT_1_USER_AGENT=Mozilla/5.0 (...)
ACCOUNT_1_TG_RAW_DATA=query_id=1234&user=...

ACCOUNT_2_USER_AGENT=Mozilla/5.0 (...)
ACCOUNT_2_TG_RAW_DATA=query_id=2345&user=...
  `);
  }

  const processingAccounts = accounts.map(proccessAccount);

  await Promise.allSettled(processingAccounts)
}

main()