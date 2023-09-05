// Create an empty object
const myObject = {
  field1: "value1",
  field2: "value2",
  field3: 42,
  field4: { nestedField: "nestedValue" },
};

// Alternatively, you can set fields when creating the object
const anotherObject = {
  fieldA: "foo",
  fieldB: "bar",
  fieldC: 123,
};

Object.assign(myObject, anotherObject);
console.log(myObject);
