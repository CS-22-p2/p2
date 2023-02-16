
const event = { name: "My Event", host: "John Doe", time: "3:00 PM", date: "2023-02-20" };

collection.insertOne(event, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Event successfully inserted into the database");
  }
});

collection.find({}).toArray((err, events) => {
  if (err) {
    console.log(err);
  } else {
    console.log(events);
  }
});

