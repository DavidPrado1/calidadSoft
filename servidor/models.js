const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  fullname: { 
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: false,
  },
  fecha_nac: {
    type: Date,
    required: true,
    //min: '1987-09-28',
    //max: '1994-05-23'
  },
  genero:{
    type:String,
    enum: ['Masculino', 'Femenino']
  },
  intereses:{
    type:[String],
    required: true,
  },
  galeria:{
    type:[String],
    required: false,
  },
  ubicacion: {
    type: String,
    required: false,
  },
  matches:{
    type:[String],
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

const ChatSchema = new mongoose.Schema({
  usuario1: {
    type: String,
    required: true,
  },
  usuario2: { 
    type: String,
    required: true
  },
  mensajes:[{
    usuario: String,
    tipo: String,
    media: String,
  }], 
},{ timestamps: true });
const Chat = mongoose.model("Chat", ChatSchema);

const MatchSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: false,
  },
  usuario1: {
    type: String,
    required: true,
  },
  usuario2: { 
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['Aceptado', 'Pendiente','Rechazado'],
    required: true,
  }
});
const Match = mongoose.model("Match", MatchSchema);

const HistoriaSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  media: { 
    type: String,
    required: true
  },
  descripcion: {
    type: String,
  }
});
const Historia = mongoose.model("Historia", HistoriaSchema);

module.exports = { User,Match,Chat,Historia};