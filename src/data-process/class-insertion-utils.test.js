const {input_validation, date_conversion_formatting, get_duration} = require("./class-insertion-utils")

// Input Validation
test("Input Validation Expected Missing", () => {
    expect(input_validation()).toBe(false)
    expect(input_validation(1)).toBe(false)
    expect(input_validation("string")).toBe(false)
    expect(input_validation(true)).toBe(false)
    expect(input_validation({})).toBe(false)
})

test("Input Validation Strings", () => {
    expect(input_validation("string", "str")).toBe(true)
    expect(input_validation("", "str")).toBe(true)

    expect(input_validation(undefined, "str")).toBe(false)
    expect(input_validation(1, "str")).toBe(false)
})

test("Input Validation Integers", () => {
    expect(input_validation(1, "int")).toBe(true)
    expect(input_validation(0, "int")).toBe(true)
    expect(input_validation(-1, "int")).toBe(true)

    expect(input_validation(undefined, "int")).toBe(false)
    expect(input_validation("one", "int")).toBe(false)
    expect(input_validation("1", "int")).toBe(false)
})

test("Input Validation Booleans", () => {
    expect(input_validation(true, "bool")).toBe(true)
    expect(input_validation(false, "bool")).toBe(true)

    expect(input_validation(1, "bool")).toBe(false)
    expect(input_validation(0, "bool")).toBe(false)
    expect(input_validation(undefined, "bool")).toBe(false)
    expect(input_validation("1", "bool")).toBe(false)
})

test("Input Validation Objects", () => {
    expect(input_validation({}, "obj")).toBe(true)
    expect(input_validation({nestedObj: {}}, "obj")).toBe(true)

    expect(input_validation(undefined, "obj")).toBe(false)
})

// Date conversion formatting

// Get duration
test("Get Duration - Different durations", () => {
    expect(get_duration("Duration: 1 hr 30 min")).toBe("1 hour(s) and 30 minute(s)")

    // The cases for these needs to be fixed
    expect(get_duration("Duration: -1 hr 30 min")).toBe("-1 hour(s) and 30 minute(s)")
    expect(get_duration("Duration: 0 hr 0 min")).toBe("0 hour(s) and 0 minute(s)")
})

test("Get Duration - Invalid input", () => {
    expect(get_duration("Duration: ")).toBe("")
    expect(get_duration("")).toBe("")

    // To solve these, there should probably be a check to see if the input is a string or not.
    expect(get_duration(undefined)).toBe("")
    expect(get_duration(true)).toBe("")
    expect(get_duration(1)).toBe("")
    expect(get_duration()).toBe("")
})