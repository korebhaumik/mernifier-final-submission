db = db.getSiblingDB('mydb');
db.customers.insertMany([
    { name: "John", address: "Highway 71"},
    { name: "Peter", address: "Lowstreet 4"},
    { name: "Amy", address: "Apple st 652"},
]);