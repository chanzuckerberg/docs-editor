// @flow


function randomInt(range: number): number {
  return Math.round(range * Math.random());
}

function randomStr(range: number): string {
  return Math.round(randomInt(range)).toString(36);
}

// This prefix should ensure that id is unique across multiple
// web pages and sessions.
const ID_PREFIX = 'id-' + randomStr(9999) + '-' + Date.now().toString(36) + '-';

let seed = 0;

function uniqueID(): string {
  return ID_PREFIX + String(seed++);
}

export default uniqueID;
