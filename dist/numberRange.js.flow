// @overflow

function numberRange(
  from: number,
  to: number,
  increment: ?number,
): Array<number> {
  if (increment &&  Math.round(increment) !== increment) {
    // increment has decimal, need to fix the float point adding issue.
    const scale = 100000;
    const range = numberRange(from * scale, to * scale, increment * scale);
    return range.map( n => Math.round(n) / scale);
  }

  const result = [];
  let min = from;
  let max = to;
  const delta = increment || 1;
  while (min <= max) {
    result.push(min);
    min += delta;
  }
  const last = result.pop();
  if (last !== undefined) {
    result.push(last);
    if (last < max) {
      result.push(max);
    }
  }
  return result;
}

export default numberRange;
