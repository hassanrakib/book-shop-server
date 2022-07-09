const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// cors middleware
app.use(cors());
app.use(express.json());

// connection uri that instructs mongodb how to connect to db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@gooyo.oj2dmbn.mongodb.net/?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const client = new MongoClient(uri);

async function run() {
  try {
    // connect to mongodb cluster using the connect method
    await client.connect();
    console.log("Database connection established!");

    // database
    const db = client.db("db-X2go");

    // collections
    const books = db.collection("books");
    const users = db.collection("users");

    // get the books
    app.get("/books", async (req, res) => {
      const cursor = books.find();
      const booksToSend = await cursor.toArray();
      res.json(booksToSend);
    });

    // get a user from db
    app.get("/users/:userId", (req, res) => {
      console.log(req.params);
      res.json(req.params);
    });

    // add a new user to db
    app.post("/users", (req, res) => {
      const newUser = req.body;
      console.log(newUser);
    });
  } finally {
    // close the connection after completing the task
    // client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
