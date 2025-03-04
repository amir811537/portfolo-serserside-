const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// amirhossainbc75
// sHiKJoo3fAljOTPP

// midewaare
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3yb9d5d.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const furnitureCollection=client.db('productDB').collection('furnitures')

    const protfolioCollection = client.db("productDB").collection("protfolio");
    const projectCollection = client.db("productDB").collection("project");

 


  // added project related api post
    app.post("/project", async (req, res) => {
      const project = req.body;
      const result = await projectCollection.insertOne(project);
      res.send(result);
    });

    //getting all projects
    app.get("/project", async (req, res) => {
      const cursor = projectCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
 
    // Update project info (PATCH)
    app.patch("/project/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProject = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedProject };
    
      const result = await projectCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

  //  Delete project info (DELETE)
    app.delete("/project/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      
      const result = await projectCollection.deleteOne(filter);
      res.send(result);
    });
    
    
    // Update profile photo URLs (PATCH)
app.patch("/protfolio/:id", async (req, res) => {
  const { id } = req.params;
  const { images } = req.body;

  try {
      const result = await protfolioCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { images } }
      );

      if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Profile updated successfully" });
      } else {
          res.status(400).send({ success: false, message: "No changes made" });
      }
  } catch (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});


    //getting all Protfolo info
    app.get("/protfolio", async (req, res) => {
      const cursor = protfolioCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
