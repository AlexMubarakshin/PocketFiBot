const createApi = require('./api');
const parseApplicationEnvs = require('./environments');

const envs = parseApplicationEnvs();

const api = createApi({
  referrerUrl: envs.REFFERER_URL,
  apiRootUrl: envs.API_ROOT_URL
});

function logProcessing(emoji, message, logLevel, showMessage) {
  const logMessage = showMessage ? message : '*****🕵️*****';
  const result = `${emoji}  ${logMessage}`;

  if (logLevel in console) {
    console[logLevel](result);
  } else {
    console.log(result);
  }
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

  const { userMining: { miningAmount = 0, dttmLastPayment, speed } } = await api.getUserMining({
    rawData: TG_RAW_DATA,
    userAgent: USER_AGENT
  });

  const mined = calculateMiningAmount(miningAmount, dttmLastPayment, speed);

  logProcessing('⛏️', `[${NAME}] Mining amount: ${miningAmount}`, 'log', envs.SHOW_LOGS_MESSAGES);

  if (mined < envs.MIN_MINING_AMOUNT) {
    logProcessing('🫠', `[${NAME}] Cannot withdraw, mined amount is less than ${envs.MIN_MINING_AMOUNT}`, 'log', envs.SHOW_LOGS_MESSAGES);

    return;
  }

  try {
    const { userMining: { gotAmount } } = await api.claimMining({
      rawData: TG_RAW_DATA,
      userAgent: USER_AGENT
    });
    logProcessing('✅', `[${NAME}] Successfully claimed ${mined}`, 'log', envs.SHOW_LOGS_MESSAGES);
    logProcessing('💰', `[${NAME}] Total amount: ${gotAmount}`, 'log', envs.SHOW_LOGS_MESSAGES);
  } catch (error) {
    logProcessing('❌', `[${NAME}] Error while claiming: ${error.message}`, 'error', envs.SHOW_LOGS_MESSAGES);
  }
}

async function main() {
  const accounts = envs.ACCOUNTS;
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

  await Promise.allSettled(processingAccounts);
}

main();
