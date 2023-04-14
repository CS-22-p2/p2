
const { describe } = require('node:test');
const testing = require('./relevancy-score');

test('Should remove numbers, trailing whitespace, and lowercase the word', () => {
  expect(testing.format_string("Selmalagerløfsvej 12")).toBe("selmalagerløfsvej");
  expect(testing.format_string(" Selmalagerløfsvej 12")).toBe("selmalagerløfsvej");
  expect(testing.format_string(" Selmalagerløfsvej 12 ")).toBe("selmalagerløfsvej");
  expect(testing.format_string(" Selma lagerløfsvej 12 ")).toBe("selma lagerløfsvej");
});
