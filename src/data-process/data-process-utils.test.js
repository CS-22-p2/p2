import { describe } from "node:test"
import {
    input_validation,
    date_conversion_formatting,
    time_until_event,
    get_duration,
    format_address,
    on_campus,
    time_left_score,
    strip_and_trim,
    read_description,
} from "./data-process-utils.js"

// https://jestjs.io/docs/expect - Expect documentation where you can find what things to check for.
// 'not' is the negation of whatever you want to check, e.g 'expect(test_func()).not.toBe(1)'

// 'describe' creates a group of tests. These can be nested.

// Input Validation
describe("Input Validation", () => {
    describe("Expected Argument - Missing", () => {
        test("No input", () => {
            expect(input_validation()).toBe(false)
        })
    
        test("Numbers", () => {
            expect(input_validation(1)).toBe(false)
        })
    
        test("Strings", () => {
            expect(input_validation("string")).toBe(false)
        })
    
        test("Booleans", () => {
            expect(input_validation(true)).toBe(false)
        })
    
        test("Objects", () => {
            expect(input_validation({})).toBe(false)
        })
    })

    describe("Expected Argument - Strings", () => {
        test("Populated string", () => {
            expect(input_validation("string", "str")).toBe(true)
        })

        test("Empty string", () => {
            expect(input_validation("", "str")).toBe(true)
        })

        test("Undefined", () => {
            expect(input_validation(undefined, "str")).toBe(false)
        })

        test("Number", () => {
            expect(input_validation(1, "str")).toBe(false)
        })

        test("Boolean", () => {
            expect(input_validation(true, "str")).toBe(false)
        })
    })

    describe("Expected Argument - Integers", () => {
        test("Positive", () => {
            expect(input_validation(1, "int")).toBe(true)
        })

        test("Zero", () => {
            expect(input_validation(0, "int")).toBe(true)
        })

        test("Negative", () => {
            expect(input_validation(-1, "int")).toBe(true)
        })

        test("Undefined", () => {
            expect(input_validation(undefined, "int")).toBe(false)
        })

        test("\"One\"", () => {
            expect(input_validation("one", "int")).toBe(false)
        })

        test("\"1\"", () => {
            expect(input_validation("1", "int")).toBe(false)
        })
    })

    describe("Expected Argument - Booleans", () => {
        test("True", () => {
            expect(input_validation(true, "bool")).toBe(true)
        })

        test("False", () => {
            expect(input_validation(false, "bool")).toBe(true)
        })

        test("1", () => {
            expect(input_validation(1, "bool")).toBe(false)
        })

        test("0", () => {
            expect(input_validation(0, "bool")).toBe(false)
        })

        test("Undefined", () => {
            expect(input_validation(undefined, "bool")).toBe(false)
        })

        test("\"1\"", () => {
            expect(input_validation("1", "bool")).toBe(false)
        })
    })

    describe("Expected Argument - Objects", () => {
        test("Empty object", () => {
            expect(input_validation({}, "obj")).toBe(true)
        })

        test("Nested empty object", () => {
            expect(input_validation({nestedObj: {}}, "obj")).toBe(true)
        })

        test("Undefined", () => {
            expect(input_validation(undefined, "obj")).toBe(false)
        })
    })
})

// Date conversion formatting
describe("Date Conversion Formatting", () => {
    describe("Formats", () => {
        test("Format #1", () => {
            expect(date_conversion_formatting('TUESDAY, MAY 2, 2023 AT 5:30 PM – 7:00 PM UTC+02')).not.toBeNull()
        })

        test("Format #2", () => {
            expect(date_conversion_formatting('WEDNESDAY, APRIL 26, 2023 AT 6:30 PM UTC+02')).not.toBeNull()
        })

        test("Format #3", () => {
            expect(date_conversion_formatting('JUN 17 AT 4:00 PM – JUN 18 AT 2:00 AM UTC+02')).not.toBeNull()
        })
    })

    describe("Invalid input", () => {
        test("Empty", () => {
            expect(date_conversion_formatting("")).toBeNull()
        })

        test("Bad timestamp", () => {
            expect(date_conversion_formatting("TUESDAY")).toBeNull()
        })
    })
})

// Time until event
describe("Time Until Event", () => {
    test("Difference between two present dates should be 0", () => {
        let current_date = new Date()
        let precision = 2
    
        // Difference between the same dates (present time) should be zero
        expect(time_until_event(current_date)).toBeCloseTo(0, precision)
    })

    describe("Invalid input", () => {
        let invalid_date

        test("Non-date object", () => {
            expect(time_until_event({})).toBeNull()
        })

        test("Invalid date object", () => {
            invalid_date = new Date(8.64e15 + 1)
            expect(time_until_event(invalid_date)).toBeNaN()
        })

        test("Bad timestamp", () => {
            invalid_date = new Date("invalid date")
            expect(time_until_event(invalid_date)).toBeNaN()
        })
    })
})

// Get duration
describe("Get Duration", () => {
    describe("Differnt durations", () => {
        test("Positive", () => {
            expect(get_duration("Duration: 1 hr 30 min")).toBe("1 hour(s) and 30 minute(s)")
        })

        test("Negative", () => {
            expect(get_duration("Duration: -1 hr 30 min")).toBe("-1 hour(s) and 30 minute(s)")
        })

        test("Zero", () => {
            expect(get_duration("Duration: 0 hr 0 min")).toBe("0 hour(s) and 0 minute(s)")
        })
    })

    describe("Invalid input", () => {
        test("Unfinished string", () => {
            expect(get_duration("Duration: ")).toBe("")
        })

        test("Empty string", () => {
            expect(get_duration("")).toBe("")
        })

        test("Undefined", () => {
            expect(get_duration(undefined)).toBe("")
        })

        test("Boolean", () => {
            expect(get_duration(true)).toBe("")
        })
        
        test("1", () => {
            expect(get_duration(1)).toBe("")
        })

        test("No args", () => {
            expect(get_duration()).toBe("")
        })
    })
})

// Format address
describe("Format address", () => {
    describe("Addresses", () => {
        test("Cassiopeia", () => {
            expect(format_address("Selma Lagerløfs Vej 300, 9220 Aalborg")).toBe("selma lagerløfs vej")
        })

        test("Aalborg University", () => {
            expect(format_address("Kroghstræde 3, 9220 Aalborg Øst")).toBe("kroghstræde")
        })
    })

    describe("Invalid input", () => {
        let expected = ""

        test("Empty string", () => {
            expect(format_address("")).toBe(expected)
        })

        test("Undefined", () => {
            expect(format_address(undefined)).toBe(expected)
        })

        test("Number", () => {
            expect(format_address(1)).toBe(expected)
        })

        test("Boolean", () => {
            expect(format_address(true)).toBe(expected)
        })

        test("Objects", () => {
            expect(format_address({})).toBe(expected)
        })
    })
})

// On campus
describe("On Campus", () => {
    // Addresses have already been tested with 'format_address'

    describe("Invalid input", () => {
        let expected = false

        test("Empty string", () => {
            expect(on_campus("")).toBe(expected)
        })

        test("Unlisted address", () => {
            expect(on_campus("Fibigerstræde 15, 9220 Aalborg").toBe(expected))
        })
    })
})