let iterator = 0;

/**
 * Utility class providing static methods for common string operations.
 */
// @dynamic
export default class StringUtil {
  /**
   * Translates camel case to regular string.
   * @see https://stackoverflow.com/a/6229124/490161
   * @example
   * let a = StringUtil.camelCaseToRegular('helloWorld')
   * // returns 'Hello World'
   * let b = StringUtil.camelCaseToRegular('ILoveYOU')
   * // returns 'I Love YOU'
   * @param string
   * @return
   */
  static camelCaseToRegular(string) {
    return (
      string
        // insert a space between lower case & upper case characters
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // space before last upper case in a sequence followed by lower case
        .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
        // uppercase the first character
        .replace(/^./, first => first.toUpperCase())
    );
  }

  /**
   * Returns unique identifier for current session.
   * @return
   */
  static uniqueId() {
    return 'u' + (++iterator).toString(16);
  }

  /**
   * Separates string into chunks of given length.
   * @param string
   * @param  length
   * @return
   */
  static chunk(string, length) {
    return string !== '' ? string.match(new RegExp(`.{1,${length}}`, 'g')) : [];
  }

  /**
   * Returns true, if given string contains a whitespace at given index.
   * @param string
   * @param  [index=0]
   * @return
   */
  static isWhitespace(string, index = 0) {
    const character = string[index];
    return character ? character.match(/\s/) !== null : false;
  }

  /**
   * Removes Unicode whitespace characters.
   * @param string
   * @return String without whitespaces
   */
  static removeWhitespaces(string) {
    return this.replaceWhitespaces(string, '', true);
  }

  /**
   * Replaces Unicode whitespace characters with U+20 space character.
   * @param string Haystack
   * @param  [reduceToSingle=false] Wether to replace
   * multiple successive space characters with a single one
   * @return
   */
  static normalizeWhitespaces(string, reduceToSingle = false) {
    return this.replaceWhitespaces(string, ' ', reduceToSingle);
  }

  /**
   * Replaces Unicode whitespace characters with given character.
   * @param string Haystack
   * @param replacement Replacement string
   * @param  [reduceToSingle=false] Wether to replace
   * multiple successive space characters with a single one
   * @return
   */
  static replaceWhitespaces(string, replacement, reduceToSingle = false) {
    return reduceToSingle
      ? string.replace(/\s+/g, replacement)
      : string.replace(/\s/g, replacement);
  }
}
