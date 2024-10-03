/**
 * Generates a random/psuedo random number from 0 up to the specified maximum value.
 * @param {Number} max The maximum value to generate. 
 * @returns {Number} The random number.
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}