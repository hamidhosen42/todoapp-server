const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.prm7h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("todoNode").collection("todos");
    console.log("connect");

    // load data  from mongodbdb
    app.get("/todos", async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });

    // POST data  into mongodbdb
    app.post("/todo", async (req, res) => {
      const newTask = req.body;
      const result = await todoCollection.insertOne(newTask);
      res.send(result);
    });

    // DELETE data from mongodbdb
    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running To do App server");
});

app.listen(port, () => {
  console.log(`Listening to port ${port} `);
});
