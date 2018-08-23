// @flow

function hadnleMatch(matched: string): string {
  return matched[0] + '-' + matched[1].toLowerCase();
}

// converts `fooBar` to `foo-bar`.
function hyphenize(str: string): string {
  return str.replace(/[a-z][A-Z]/g, hadnleMatch);
}

export default hyphenize;
