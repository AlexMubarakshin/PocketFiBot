const REFFERER_URL = process.env.REFFERER_URL || "https://pocketfi.app/";
const API_ROOT_URL = process.env.API_ROOT_URL || "https://bot.pocketfi.org";
const USER_AGENT = process.env.USER_AGENT || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)'
const MIN_MINING_AMOUNT = Number(process.env.MIN_MINING_AMOUNT || 0.25);

/**
 * 
 * @param {String} url 
 * @param {String} method
 * @param {String} rawData 
 * @returns 
 */
async function makeRequest(url, method, rawData) {
  const response = await fetch(url, {
    "cache": "default",
    "credentials": "omit",
    "headers": {
      "Accept": "*/*",
      "Accept-Language": "en-GB,en;q=0.9",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "telegramRawData": rawData,
      "User-Agent": USER_AGENT
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

async function main() {
  const rawDataEnv = process.env.TG_RAW_DATA;
  if (!rawDataEnv) {
    throw new Error(`"TG_RAW_DATA" environment variable is not set.
Open the telegarm DevTools and extract the "telegramRawData" header from the request.
Add it to the environment variable "TG_RAW_DATA".

Example:
TG_RAW_DATA=query_id=1234&user=...
`);
  }


  const { userMining: { miningAmount = 0, dttmLastPayment, speed } } = await makeRequest(`${API_ROOT_URL}/mining/getUserMining`, 'GET', rawDataEnv);

  const mined = calculateMiningAmount(miningAmount, dttmLastPayment, speed);

  console.log(`⛏️  Mined amount: ${mined}`);

  if (mined < MIN_MINING_AMOUNT) {
    console.log(`🫠  Cannot withdraw, mined amount is less than ${MIN_MINING_AMOUNT}`);

    return;
  }

  try {
    const { userMining: { gotAmount } } = await makeRequest(`${API_ROOT_URL}/mining/claimMining`, 'POST', rawDataEnv);
    console.log(`✅  Successfully claimed ${mined}`);
    console.log('💰  Total amount: ', gotAmount)
  } catch (error) {
    console.error(`❌  Error while claiming: ${error.message}`);
  }
}

main()