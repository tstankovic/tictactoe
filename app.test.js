const { validate } = require("./app");

test("good input", () => {
  const input = ["1", "3"];
  expect(validate(input)).toBeUndefined();
});

test("bad input - out of bounds", () => {
  const input = ["0", "0"];
  expect(validate(input)).toBe(
    "Invalid input: those coordinates are outside the playable area"
  );
});

test("bad input - missing params", () => {
  const input = ["2"];
  expect(validate(input)).toBe(
    "Invalid input: you must enter the x and y coordinates separated by spaces"
  );
});
