const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f1tlo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db("to-do-app").collection("tasks");

    app.get("/tasks", async (req, res) => {
      const query = {};
      const cursor = tasksCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });


    // added Tasks

    app.post("/task", async (req, res) => {
      const task = req.body.data;
      const result = await tasksCollection.insertOne(task);
      console.log(result);
      res.send(result);
    });


    
    
    // delete

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("To Do Server update");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
