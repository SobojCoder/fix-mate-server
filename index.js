import express from "express";
import cors from "cors";
import "dotenv/config";



const app = express();
const PORT = process.env.port || 5000;

app.use(express.json());
app.use(cors());

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-fp5z2sz-shard-00-00.yfbjwpb.mongodb.net:27017,ac-fp5z2sz-shard-00-01.yfbjwpb.mongodb.net:27017,ac-fp5z2sz-shard-00-02.yfbjwpb.mongodb.net:27017/?ssl=true&replicaSet=atlas-fg8pkp-shard-0&authSource=admin`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
const fixMateCollection = connectedClient.db("FixMate");
const services = fixMateCollection.collection("services");
const bookings = fixMateCollection.collection("bookings")


app.get("/", (req, res)=>{
    res.send("FixMate server is running!")
})

app.post("/services", async(req, res)=>{
  const service = req.body;
  const reslut = await services.insertOne(service);
  res.send(reslut)

})

app.get("/services", async(req, res)=>{
  const query= {}

  if(req.query.category){
    query.category = req.query.category
  }
  if(req.query.serviceMode){
    query.serviceMode = req.query.serviceMode
  }
   if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } },
      { serviceMode: { $regex: req.query.search, $options: "i" } },
      { serviceArea: { $regex: req.query.search, $options: "i" } },
    ];
  }
    const result = await services.find(query).toArray();
    res.send(result);
})

app.get("/services/:id", async(req, res)=>{
  const id = req.params.id;
  const result = await services.findOne({_id: new ObjectId(id)});

  res.send(result)
})

//booking api

app.post("/bookings", async(req, res)=>{
  const service = req.body;
  const result = await bookings.insertOne(service);

  res.send(result);
})

app.get("/bookings/:id", async(req, res)=>{
  const id = req.params.id;
  const result = await bookings.findOne({_id: new ObjectId(id)})
})

app.listen(PORT, ()=>{
    console.log(`FixMate server is running on port ${PORT}`);
})