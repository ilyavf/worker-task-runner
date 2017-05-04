/**
 * @module shared-array-helpers
 * Helpers to work with SharedArrayBuffer
 */

const globalScope = typeof window !== 'undefined' ? window : self

/**
 * @function createBuffer
 * @param {Number} size
 * @param {String | Constructor} type Type of array
 * @return {SharedArrayBuffer}
 */
// createBuffer :: Number -> Mixed -> SharedArrayBuffer
const createBuffer = (size, type) => {
  const bytesPerElement = typeof type === 'function' ? type.BYTES_PER_ELEMENT : globalScope[type].BYTES_PER_ELEMENT
  return new globalScope.SharedArrayBuffer(size * bytesPerElement)
}
/**
 * @function bufferToArray
 * @param {Object<SharedArrayBuffer, String>} params Params contain buffer and type of the array
 * @return {TypedArray}
 */
// Type: Result = Object <SharedArrayBuffer,String>
// bufferToArray :: Result -> Array
const bufferToArray = ({ buffer, type }) =>
  new globalScope[type](buffer)

module.exports = {
  createBuffer,
  bufferToArray
}