/**
 * Generic, extendable error.
 * Requires babel-plugin-transform-builtin-extend babel plugin.
 * @see https://stackoverflow.com/questions/31089801/
 */
export default class GenericError extends Error {
  /**
   * Constructor
   * @param  message
   */
  constructor(message) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GenericError.prototype);
  }
}
