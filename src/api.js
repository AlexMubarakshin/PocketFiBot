
/**
 * @param {Object} options - The options object.
 * @param {string} options.url - The URL to which the request is made.
 * @param {string} options.referrer - The referrer URL for the request.
 * @param {string} options.method - The HTTP method to be used for the request (e.g., 'GET', 'POST').
 * @param {Object} options.rawData - The raw data to be sent with the request body.
 * @param {string} options.userAgent - The User-Agent header for the request.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON response.
 * @throws {Error} If the request fails or the response status is not ok.
 */
async function makeRequest({ url, method, rawData, userAgent, referrer }) {
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
    "referrer": referrer,
    "referrerPolicy": "strict-origin-when-cross-origin"
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}

function createApi({
  referrerUrl,
  apiRootUrl,
}) {
  const getUserMining = async ({ rawData, userAgent }) => {
    return makeRequest({
      url: `${apiRootUrl}/mining/getUserMining`,
      method: 'GET',
      rawData,
      userAgent,
      referrer: referrerUrl,
    });
  };

  const claimMining = async ({ rawData, userAgent }) => {
    return makeRequest({
      url: `${apiRootUrl}/mining/claimMining`,
      method: 'POST',
      rawData,
      userAgent,
      referrer: referrerUrl,
    });
  };

  return {
    getUserMining,
    claimMining,
  };
}

module.exports = createApi;