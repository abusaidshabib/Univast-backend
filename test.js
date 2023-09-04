const myObject = {
  foo: {
    program_type: String,
    last_complete_degree_type: String,
    program: String,
    medium: String,
    education_shift: String,
  },
  baz: "qux",
};
delete myObject.foo.program_type;
console.log(myObject)

const myObject = {
  foo: {
    program_type: "SomeValue",
    last_complete_degree_type: "AnotherValue",
    program: "YetAnotherValue",
    medium: "OneMoreValue",
    education_shift: "FinalValue",
  },
  baz: "qux",
};

// List of fields you want to delete
const fieldsToDelete = ["program_type", "program", "education_shift"];

// Iterate through the fieldsToDelete array and delete the corresponding properties
for (const field of fieldsToDelete) {
  if (myObject.foo.hasOwnProperty(field)) {
    delete myObject.foo[field];
  }
}

console.log(myObject);