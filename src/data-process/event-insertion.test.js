import { input_validation, date_conversion_formatting, get_duration, time_until_event, format_address, repeated_events, on_campus, time_left_score, strip_and_trim, read_description } from './event-insertion';

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

describe('date_conversion_formatting', () => {
  test('Converts "WEDNESDAY, 19 APRIL 2023" to "2023-04-19"', () => {
    const inputDate = "WEDNESDAY, 19 APRIL 2023";
    const expectedOutput = "2023-04-19";
    expect(date_conversion_formatting(inputDate)).toEqual(expectedOutput);
  });
  test('Converts "SUNDAY, 2 MAY 2023" to "2023-05-02"', () => {
    const inputDate = "SUNDAY, 2 MAY 2023";
    const expectedOutput = "2023-05-02";
    expect(date_conversion_formatting(inputDate)).toEqual(expectedOutput);
  });
});
