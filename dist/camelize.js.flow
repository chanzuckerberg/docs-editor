// @flow

function hadnleMatch(_: any, char: string): string {
  return char.toUpperCase();
}

// converts `foo-bar` to `fooBar`.
function camelize(str: string): string {
  return str.replace(/[_.-](\w|$)/g, hadnleMatch);
}

export default camelize;
