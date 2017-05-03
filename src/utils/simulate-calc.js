/**
 * @module {Function} simulateCalc
 * @parent utils
 *
 * Simulates a synchronous calculation (in ms)
 *
 * @signature `simulateCalc( 1000 )`
 *
 *  @param {Number} t
 *  Number of milliseconds
 */
module.exports = t => {
  const start = Date.now()
  while (Date.now() - start < t) {}
}