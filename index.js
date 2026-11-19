import express from "express";
import cors from "cors";
import "dotenv/config";



const app = express();
const PORT = process.env.port || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.send("FixMate server is running!")
})

app.listen(PORT, ()=>{
    console.log(`FixMate server is running on port ${PORT}`);
})