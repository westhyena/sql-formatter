import { last } from '../utils';

const INDENT_TYPE_TOP_LEVEL = 'top-level';
const INDENT_TYPE_BLOCK_LEVEL = 'block-level';
const INDENT_TYPE_FROM_LEVEL = 'from-level';

/**
 * Manages indentation levels.
 *
 * There are two types of indentation levels:
 *
 * - BLOCK_LEVEL : increased by open-parenthesis
 * - TOP_LEVEL : increased by RESERVED_TOP_LEVEL words
 */
export default class Indentation {
  /**
   * @param {String} indent Indent value, default is "  " (2 spaces)
   */
  constructor(indent) {
    this.indent = indent || '  ';
    this.indentTypes = [];
  }

  /**
   * Returns current indentation string.
   * @return {String}
   */
  getIndent() {
    return this.indent.repeat(this.indentTypes.length);
  }

  /**
   * Increases indentation by one top-level indent.
   */
  increaseTopLevel() {
    this.indentTypes.push(INDENT_TYPE_TOP_LEVEL);
  }

  increaseFromLevel() {
    if (last(this.indentTypes) !== INDENT_TYPE_FROM_LEVEL) {
      this.indentTypes.push(INDENT_TYPE_FROM_LEVEL);
    }
  }

  /**
   * Increases indentation by one block-level indent.
   */
  increaseBlockLevel() {
    this.indentTypes.push(INDENT_TYPE_BLOCK_LEVEL);
  }

  /**
   * Decreases indentation by one top-level indent.
   * Does nothing when the previous indent is not top-level.
   */
  decreaseTopLevel() {
    // if (this.indentTypes.length > 0 && last(this.indentTypes) === INDENT_TYPE_TOP_LEVEL) {
    //   this.indentTypes.pop();
    // }
    while (this.indentTypes.length > 0) {
      if (last(this.indentTypes) === INDENT_TYPE_BLOCK_LEVEL) {
        break;
      }
      const type = this.indentTypes.pop();
      if (type === INDENT_TYPE_TOP_LEVEL) {
        break;
      }
    }
  }

  decreaseFromLevel() {
    if (this.indentTypes.length > 0 && last(this.indentTypes) === INDENT_TYPE_FROM_LEVEL) {
      this.indentTypes.pop();
    }
  }

  /**
   * Decreases indentation by one block-level indent.
   * If there are top-level indents within the block-level indent,
   * throws away these as well.
   */
  decreaseBlockLevel() {
    while (this.indentTypes.length > 0) {
      const type = this.indentTypes.pop();
      if (type !== INDENT_TYPE_TOP_LEVEL) {
        break;
      }
    }
  }

  decreaseLastBlockLevel() {
    if (this.indentTypes.length > 0 && last(this.indentTypes) === INDENT_TYPE_BLOCK_LEVEL) {
      this.indentTypes.pop();
    }
  }

  resetIndentation() {
    this.indentTypes = [];
  }
}
