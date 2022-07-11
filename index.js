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
    app.get("/users/:userId", async (req, res) => {
      const uid = req.params.userId;
      const query = { uid };
      const user = await users.findOne(query);
      res.json(user);
    });

    // add a new user to db
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await users.insertOne(newUser);
      res.json(result);
    });

    // update the cart of a user
    app.put("/users/:userId/cart", async (req, res) => {
      const filter = { uid: req.params.userId };
      const updateCart = { $set: { cart: req.body.updatedCart } };
      const result = await users.updateOne(filter, updateCart);
      res.json(result);
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
