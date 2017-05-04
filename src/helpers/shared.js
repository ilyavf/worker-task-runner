/**
 * @module shared-array-helpers
 * Helpers to work with SharedArrayBuffer
 */

/**
 * @function createBuffer
 * @param {Number} size
 */
// createBuffer :: Number -> SharedArrayBuffer
const createBuffer = size =>
  new window.SharedArrayBuffer( size * Int32Array.BYTES_PER_ELEMENT )

/**
 * @function bufferToArray
 * @param {SharedArrayBuffer} buffer
 * @param {String} type Typed array to be instantiated with buffer data
 */
// Result = Object <type, buffer>
// bufferToArray :: Result -> Array
const bufferToArray = ({ buffer, type }) =>
  new window[type]( buffer )

module.exports = {
  createBuffer,
  bufferToArray
}