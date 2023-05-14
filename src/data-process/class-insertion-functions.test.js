const {input_validation} = require("./class-insertion-functions")

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
    expect(input_validation(1, "bool")).toBe(true)

    expect(input_validation(0, "bool")).toBe(false)
    expect(input_validation(undefined, "bool")).toBe(false)
    expect(input_validation("1", "bool")).toBe(false)
})

test("Input Validation Objects", () => {
    expect(input_validation({}, "obj")).toBe(true)
    expect(input_validation({nestedObj: {}}), "obj").toBe(true)

    expect(input_validation(undefined, "obj")).toBe(false)
})