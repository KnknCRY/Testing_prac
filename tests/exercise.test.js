const exercise = require("../exercise1");

describe("fizzBuzz", () => {
  it("should thorw if input is not a number.", () => {
    expect(() => {
      exercise.fizzBuzz("a");
    }).toThrow();
    expect(() => {
      exercise.fizzBuzz(null);
    }).toThrow();
    expect(() => {
      exercise.fizzBuzz(undefined);
    }).toThrow();
    expect(() => {
      exercise.fizzBuzz({});
    }).toThrow();
  });

  it("should return fizzbuzz if input %3==0 or %5==0", () => {
    const result = exercise.fizzBuzz(15);
    expect(result).toEqual("FizzBuzz");
  });
  it("should return fizz if input %3==0", () => {
    const result = exercise.fizzBuzz(3);
    expect(result).toEqual("Fizz");
  });
  it("should return buzz if input %5==0", () => {
    const result = exercise.fizzBuzz(5);
    expect(result).toEqual("Buzz");
  });
  it("should return input if input is not %3==0 %5==0", () => {
    const result = exercise.fizzBuzz(1);
    expect(result).toEqual(1);
  });
});
