const greatestCommonDivisor = (a, b) => (!b ? a : gcd(b, a % b));

const leastCommonMultipleInner = (a, b) => (a * b) / gcd(a, b);

const leastCommonMultiple = (...numbers) =>
  numbers
    .slice(1)
    .reduce(
      (current, num) => leastCommonMultipleInner(current, num),
      numbers[0]
    );

export { greatestCommonDivisor, leastCommonMultiple };
