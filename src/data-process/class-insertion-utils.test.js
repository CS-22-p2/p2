const {
    insertion_sort,
    input_validation,
    date_conversion_formatting,
    time_until_event,
    get_duration,
    format_address,
    on_campus,
    time_left_score,
    strip_and_trim,
    read_description,
} = require("./class-insertion-utils.cjs")

// https://jestjs.io/docs/expect - Expect documentation where you can find what things to check for.
// 'not' is the negation of whatever you want to check, e.g 'expect(test_func()).not.toBe(1)'

// 'describe' creates a group of tests. These can be nested.

describe("Insertion Sort", () => {
    let arr = []

    // The elements in the array passed to insertion sort are objects where the 'value' key is the number used for sorting
    let obj = (value) => {
        return {value: value}
    }

    test("Empty array", () => {
        insertion_sort(arr)

        expect(arr.length).toBe(0)
    })

    test("Single element array", () => {
        let expected = obj(1)

        arr = [expected]
        insertion_sort(arr)

        expect(arr[0]).toBe(expected)
    })

    test("Already sorted array", () => {
        arr = [obj(1), obj(2), obj(3)]
        insertion_sort(arr)

        expect(arr[0].value).toBe(1)
        expect(arr[1].value).toBe(2)
        expect(arr[2].value).toBe(3)
    })

    test("Reverse array", () => {
        arr = [obj(3), obj(2), obj(1)]
        insertion_sort(arr)

        expect(arr[0].value).toBe(1)
        expect(arr[1].value).toBe(2)
        expect(arr[2].value).toBe(3)
    })

    test("Scrambled array", () => {
        arr = [obj(5), obj(3), obj(4), obj(2), obj(1)]
        insertion_sort(arr)

        expect(arr[0].value).toBe(1)
        expect(arr[1].value).toBe(2)
        expect(arr[2].value).toBe(3)
        expect(arr[3].value).toBe(4)
        expect(arr[4].value).toBe(5)
    })
})

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

describe("Get Duration", () => {
    describe("Differnt durations", () => {
        test("Positive", () => {
            expect(get_duration("Duration: 1 hr 30 min")).toBe("1 hour(s) and 30 minute(s)")
        })

        test("Negative", () => {
            expect(get_duration("Duration: -1 hr 30 min")).toBe("")
        })

        test("Zero", () => {
            expect(get_duration("Duration: 0 hr 0 min")).toBe("0 hour(s) and 0 minute(s)")
        })

        test("One Hour", () => {
            expect(get_duration("Duration: 1 hr")).toBe("1 hour(s)")
        })

        test("One Minute", () => {
            expect(get_duration("Duration: 1 min")).toBe("")
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
describe("Format Address", () => {
    test("Correct Address", () => {
        expect(format_address("Kroghstræde 3, Aalborg")).toBe("kroghstræde")
    })

    test("Whitespace", () => {
        expect(format_address(" Kroghstræde 3 , Aalborg ")).toBe("kroghstræde")
    })

    describe("Invalid input", () => {
        let expected = ""

        test("Empty string", () => {
            expect(format_address("")).toBe(expected)
        })

        test("Undefined", () => {
            expect(format_address(undefined)).toBe(expected)
        })

        test("Boolean", () => {
            expect(format_address(true)).toBe(expected)
        })

        test("Number", () => {
            expect(format_address(0)).toBe(expected)
        })

        test("String Object", () => {
            expect(format_address(new String())).toBe(expected)
        })
    })
})

describe("On Campus", () => {
    describe("Correct Addresses", () => {
        test("Cassiopeia", () => {
            expect(on_campus("Selma Lagerløfs Vej 300, 9220 Aalborg")).toBe(true)
        })

        test("NOVI Science Park", () => {
            expect(on_campus("Niels Jernes Vej 10, 9220 Aalborg")).toBe(true)
        })

        test("University Library", () => {
            expect(on_campus("Kroghstræde 3, 9220 Aalborg Øst")).toBe(true)
        })

        test("Campus Service", () => {
            expect(on_campus("Fredrik Bajers Vej 1, 9220 Aalborg")).toBe(true)
        })

        test("Bertil Ohtils Vej", () => {
            expect(on_campus("Bertil Ohtils Vej, 9220 Aalborg")).toBe(true)
        })
    })

    describe("Invalid input", () => {
        test("Empty string", () => {
            expect(on_campus("")).toBe(false)
        })

        test("Missing street", () => {
            expect(on_campus("9220 Aalborg")).toBe(false)
        })
    })
})