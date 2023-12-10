const express = require("express");
const mongoose = require("mongoose");

const { User,Historia,Chat,Match } = require("./models");
//const { Matches } = require("./matches");
const { default: axios, all } = require("axios");
const { addListener } = require("nodemon");
const socketio = require('socket.io');
const http = require('http');


const app = express();
var cors = require('cors')

app.use(cors())

const server = http.createServer(app);
const io = socketio(server,{
  cors: {
      origin: '*'
  }
});
app.use(express.json());


app.get("/users", async (req, res) => {
  const allUsers = await User.find();
  return res.status(200).json(allUsers);
});

app.post("/usersC", async (req, res) => {
  const user = await User.find({correo:req.body.correo}).exec();
  return res.status(200).json(user);
});

app.post("/login",async (req,res)=>{
  const user = await User.find({$and:[{correo: req.body.correo},{password:req.body.password}]});
  return res.status(200).json(user);
})

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  return res.status(200).json(user);
});

app.post("/usersByFullName", async (req, res) => {
  const user = await User.find({fullname:req.body.fullname}).exec();
  return res.status(200).json(user);
});

app.post("/users", async (req, res) => {
  test = req.body;
  test.fullname = test.nombre + " " + test.apellido;
  const newUser = new User({ ...test });
  const insertedUser = await newUser.save();
  return res.status(201).json(insertedUser);
});

app.put("/users/:id", async (req, res) => {
  const {id} = req.params;
  await User.findByIdAndUpdate(id, req.body);
  const updatedUser = await User.findById(id);
  return res.status(200).json(updatedUser);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  return res.status(200).json(deletedUser);
});

app.get("/matchs", async (req, res) => {
  const allMatchs = await Match.find();
  return res.status(200).json(allMatchs);
});

app.get("/matchs/:id", async (req, res) => {
  const { id } = req.params;
  const matchs = await Match.find({$or:[{usuario1: req.params},{usuario2:req.params}]});
  return res.status(200).json(matchs);
});

app.get("/posiblesMatchs/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const user2 = await User.find({$and:[{"_id": { "$nin": user.matches}},{'_id': {$ne: req.params.id}}]})
  return res.status(201).json(user2);
});

app.post("/posiblesMatchs2", async (req, res) => {
  const user = await User.find({correo:req.body.correo});
  const id = user[0]._id.toString();
  const user2 = await User.find({$and:[{"_id": { "$nin": user[0].matches}},{'_id': {$ne: id}}]})
  return res.status(201).json(user2);
});

app.get("/matchsIn2/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const user2 = await User.find({$and:[{"_id": { "$in": user.matches}},{'_id': {$ne: req.params.id}}]})
  return res.status(201).json(user2);
});

app.post("/matchsIn", async (req, res) => {
  const user = await User.find({correo:req.body.correo});
  const id = user[0]._id.toString();
  const user2 = await User.find({$and:[{"_id": { "$in": user[0].matches}},{'_id': {$ne: id}}]})
  return res.status(201).json(user2);
});


app.post("/matchs", async (req, res) => {
  test = req.body;
  hola = {usuario1: test.usuario1,usuario2: test.usuario2, mensajes: []}
  await User.updateOne(
    { _id: test.usuario1 }, 
    { $push: { matches: test.usuario2 } },);
  const user = await User.findById(test.usuario2);
  console.log(user.matches)
  if(user.matches.includes(test.usuario1)==true){
    console.log(test)
    const newMatch = new Match({ ...test });
    const insertedMatch = await newMatch.save();
    const newChat = new Chat({ ...hola });
    const insertedChat = await newChat.save();
  }
  return res.status(201);
});

app.put("/matchs/:id", async (req, res) => {
  const {id} = req.params;
  await Match.findByIdAndUpdate(id, req.body);
  const updatedMatch = await Match.findById(id);
  return res.status(200).json(updatedMatch);
});

app.delete("/matchs/:id", async (req, res) => {
  const { id } = req.params;
  const deletedMatch = await Match.findByIdAndDelete(id);
  return res.status(200).json(deletedMatch);
});

app.get("/chats", async (req, res) => {
  const allChats = await Chat.find();
  return res.status(200).json(allChats);
});

app.get("/chats/:id", async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  return res.status(200).json(chat);
});

app.get("/chatsUser/:id", async (req, res) => {
  const id  = req.params.id;
  const chat = await Chat.find({$or:[{usuario1: id},{usuario2:id}]});
  return res.status(200).json(chat);
});

app.post("/chatsUsers", async (req, res) => {
  const test  = req.body;
  const chat = await Chat.find({$or:[{usuario1: test.p1,usuario2:test.p2},{usuario1: test.p2,usuario2:test.p1}]});
  return res.status(200).json(chat[0]);
});

app.post("/chats", async (req, res) => {
  test = req.body;
  const newChat = new Chat({ ...test });
  const insertedChat = await newChat.save();
  return res.status(201).json(insertedChat);
});

app.post("/chats2", async (req, res) => {
  await Chat.updateOne(
    { _id: req.body.id }, 
    { $push: { mensajes: req.body.mensaje } },);
  return res.status(200);
});

app.delete("/chats/:id", async (req, res) => {
  const { id } = req.params;
  const deletedChat = await Chat.findByIdAndDelete(id);
  return res.status(200).json(deletedChat);
});

app.get("/historias", async (req, res) => {
  const allHistorias = await Historia.find();
  return res.status(200).json(allHistorias);
});

app.get("/historias/:id", async (req, res) => {
  const { id } = req.params;
  const historia = await Historia.findById(id);
  return res.status(200).json(historia);
});

app.get("/historiasUser/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const historias = await Historia.find({"usuario": { "$in": user.matches}})
  return res.status(201).json(historias);
});

app.post("/historias", async (req, res) => {
  test = req.body;
  const newHistoria = new Historia({ ...test });
  const insertedHistoria = await newHistoria.save();
  return res.status(201).json(insertedHistoria);
});

app.delete("/historias/:id", async (req, res) => {
  const { id } = req.params;
  const deletedHistoria = await Historia.findByIdAndDelete(id);
  return res.status(200).json(deletedHistoria);
});

io.on('connection', (socket) =>{
  console.log('user connected')
  console.log(socket.id)

  socket.on('message', (message, nickname) => {
      //Envio al resto de clientes con broadcast.emit
      socket.broadcast.emit('message', {
          media: message,
          usuario: nickname,
      })
  })
})

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:ulasalle@cluster0.snanhyj.mongodb.net/?retryWrites=true&w=majority"
    );
    server.listen(3001, () => console.log("Server started on port 3001"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();