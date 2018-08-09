// @flow

// This is copied from
// draft-js/src/component/utils/splitTextIntoTextBlocks.js
const NEWLINE_REGEX = /\r\n?|\n/g;

function splitTextIntoTextBlocks(text: string): Array<string> {
  return text.split(NEWLINE_REGEX);
}

export default splitTextIntoTextBlocks;
