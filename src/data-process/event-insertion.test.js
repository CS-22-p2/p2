const { input_validation, format_address, final_score, event_insert, time_left_score, high_score, base_score } = require("./event-insertion.js"); 

describe("input_validation function", () => {
  test("return true", () => {
    expect(input_validation("string text", "str")).toBe(true);
  });

  test("return false", () => {
    expect(input_validation(123, "str")).toBe(false);
    expect(input_validation(null, "str")).toBe(false);
    expect(input_validation(undefined, "str")).toBe(false);
  });

  test("return true", () => {
    expect(input_validation(123, "int")).toBe(true);
  });

  test("return false", () => {
    expect(input_validation("hello", "int")).toBe(false);
    expect(input_validation(3.14, "int")).toBe(false);
    expect(input_validation(null, "int")).toBe(false);
    expect(input_validation(undefined, "int")).toBe(false);
  });

  test("return true", () => {
    expect(input_validation(true, "bool")).toBe(true);
  });

  test("should return false when input is not a boolean", () => {
    expect(input_validation("hello", "bool")).toBe(false);
    expect(input_validation(null, "bool")).toBe(false);
    expect(input_validation(undefined, "bool")).toBe(false);
    expect(input_validation(123, "bool")).toBe(false);
  });
});

describe("format_address", () => {
  it("return proper address", () => {
    const input = "selmalagerløfsvej 12";
    const expectedOutput = "selmalagerløfsvej";
    expect(format_address(input)).toEqual(expectedOutput);
  });

  it("throw an error when wrong input", () => {
    expect(() => format_address(null)).toThrow("Wrong input");
    expect(() => format_address(123)).toThrow("Wrong input");
    expect(() => format_address(undefined)).toThrow("Wrong input");
  });
});
