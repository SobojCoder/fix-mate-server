import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-fp5z2sz-shard-00-00.yfbjwpb.mongodb.net:27017,ac-fp5z2sz-shard-00-01.yfbjwpb.mongodb.net:27017,ac-fp5z2sz-shard-00-02.yfbjwpb.mongodb.net:27017/?ssl=true&replicaSet=atlas-fg8pkp-shard-0&authSource=admin`;

const client = new MongoClient(uri);
await client.connect();
const db = client.db("FixMate");

const users = await db
  .collection("user")
  .find({}, { projection: { email: 1, name: 1, accountType: 1, role: 1 } })
  .toArray();
console.log("USERS:", JSON.stringify(users, null, 1));

const admins = users.filter((u) => u.role === "admin" || (u.accountType || "").toLowerCase() === "admin");
console.log("ADMIN COUNT:", admins.length);

await client.close();
