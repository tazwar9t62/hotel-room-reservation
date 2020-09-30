const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config();

const port = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const serviceAccount = require("./configs/burj-al-arab-10bae-firebase-adminsdk-yrbve-1964f9cab7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://burj-al-arab-10bae.firebaseio.com",
});

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.dupvj.mongodb.net/hotel-room-management?retryWrites=true&w=majority`;
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
    // console.log(newBooking);
  });
  app.get("/bookings", (req, res) => {
    const bearer = req.headers.authorization;
    // console.log(req.headers.authorization);
    if (bearer && bearer.startsWith("Bearer ")) {
      const idToken = bearer.split(" ")[1];
      //   console.log({ idToken });
      // idToken comes from the client app
      admin
        .auth()
        .verifyIdToken(idToken)
        .then(function (decodedToken) {
          let uid = decodedToken.uid;
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (tokenEmail == queryEmail) {
            bookings.find({ email: queryEmail }).toArray((err, documents) => {
              res.status(200).send(documents);
            });
          } else {
            res.status(401).send("un-authorized acess!!");
          }
          // ...
        })
        .catch(function (error) {
          // Handle error
          res.status(401).send("un-authorized acess!!");
        });
    } else {
      res.status(401).send("un-authorized acess!!");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello Tazwar!");
});

app.listen(port);
