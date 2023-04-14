
const { describe } = require('node:test');
const testing = require('./event-insertion');


// How a test could look like
test('Should remove numbers, trailing whitespace, and lowercase the word', () => {
  expect(testing.format_address("Selmalagerløfsvej 12")).toBe("selmalagerløfsvej");
  expect(testing.format_address(" Selmalagerløfsvej 12")).toBe("selmalagerløfsvej");
  expect(testing.format_address(" Selmalagerløfsvej 12 ")).toBe("selmalagerløfsvej");
  expect(testing.format_address(" Selma lagerløfsvej 12 ")).toBe("selma lagerløfsvej");
});
