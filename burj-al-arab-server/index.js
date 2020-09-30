const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://9t6:livelovedie@cluster0.dupvj.mongodb.net/hotel-room-management?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookings = client.db("hotel-room-management").collection("books");
  // perform actions on the collection object
  //   console.log("database connected");
  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(newBooking);
  });
  app.get("/bookings", (req, res) => {
    bookings.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello Tazwar!");
});

app.listen(port);
