const express=require("express");

const app=express();

app.use(express.json());

app.use("/api/notes",require("./routes/note.routes"));

module.exports=app;