import {
    eventCheck,
    checkFb,
} from "./information-gathering-utils.js"

describe("Event Check", () => {
    describe("Validation string", () => {
        test("Correct identification string", () => {
            expect(eventCheck("No events to show")).toBe(false)
        })
    
        test("Any", () => {
            expect(eventCheck("")).toBe(true)
        })
    })

    describe("Invalid input", () => {
        test("Number", () => {
            expect(eventCheck(1)).toBe(false)
        })

        test("Undefined", () => {
            expect(eventCheck(undefined)).toBe(false)
        })

        test("Boolean", () => {
            expect(eventCheck(true)).toBe(false)
        })

        test("Object", () => {
            expect(eventCheck({})).toBe(false)
        })
    })
})

describe("Check Facebook", () => {
    describe("Full links", () => {
        test("With trailing /", () => {
            expect(checkFb("https://www.facebook.com/aalborgkarneval/")).toBe("https://www.facebook.com/aalborgkarneval/upcoming_hosted_events")
        })

        test("Missing trailing /", () => {
            expect(checkFb("https://www.facebook.com/aalborgkarneval")).toBe("https://www.facebook.com/aalborgkarneval/upcoming_hosted_events")
        })

        test("No http prefix", () => {
            expect(checkFb("www.facebook.com/aalborgkarneval/")).toBe("www.facebook.com/aalborgkarneval/upcoming_hosted_events")
        })
    })

    describe("Invalid input", () => {
        let expected = "Unknown"

        test("Non-facebook link", () => {
            expect(checkFb("https://www.google.com")).toBe(expected)
        })

        test("Number", () => {
            expect(checkFb(1)).toBe(expected)
        })

        test("Boolean", () => {
            expect(checkFb(true)).toBe(expected)
        })

        test("Undefined", () => {
            expect(checkFb(undefined)).toBe(expected)
        })

        test("Object", () => {
            expect(checkFb({})).toBe(expected)
        })
    })
})