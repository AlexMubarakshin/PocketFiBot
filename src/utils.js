function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function minuteToMs(minutes) {
  return minutes * 60 * 1000;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  wait,
  minuteToMs,
  randomBetween
};