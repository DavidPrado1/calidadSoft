"use client"
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Chats.css'
import Avatar from '@material-ui/core/Avatar';
import { useSession,getSession } from "next-auth/react"
import io from 'socket.io-client'
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
const socket = io('http://localhost:3001')

function Chats() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState()
    const [pes, setPes] = useState('');
    const [hola,setHola] = useState('')
    const [foto1,setFoto1] = useState();
    const [chatAc, setChatAc]=useState([])

    useEffect(() =>{
        async function myFunction() {
            
            const session = await getSession()
            var test = session.user.image;
            setPes(test._id)
            if(typeof test == "string"){
                var consulta = {correo:session.user.email}
                var config_request={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                }
                axios.post('http://localhost:3001/matchsIn', consulta, { config_request })
                .then(res => {                                         
                    setChats(res.data)
                    console.log(pes)
                })
                .catch((error) => {
                    console.log(error)
                });
                axios.post('http://localhost:3001/usersC', consulta, { config_request })
                .then(res => {  
                    console.log(res.data[0])                                       
                    setPes(res.data[0]._id)
                    console.log(pes)
                })
                .catch((error) => {
                    console.log(error)
                });

            }else{
                axios.get('http://localhost:3001/matchsIn2/'+test._id).then(res => {                                         
                    setChats(res.data)
                    console.log(session.user.image._id)
                })
                .catch((error) => {
                    console.log(error)
                });
            }
            
            }
            myFunction() 
        
        const receivedMessage = (message) =>{
          //console.log(message)
          setMessages([...messages, message])
        
        }
        socket.on('message', receivedMessage)
    
        //Desuscribimos el estado del componente cuando ya no es necesario utilizarlo
        return () => {
          socket.off('message', receivedMessage)
        }
      }, [messages])

    const [chats, setChats] = useState([]);
    

    function doThis(ts){
        var consulta = {p1:pes,p2:ts._id}
                var config_request={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                }
                axios.post('http://localhost:3001/chatsUsers', consulta, { config_request })
                .then(res => {                                         
                    setMessages(res.data.mensajes)
                    setChatAc(res.data)
                })
                .catch((error) => {
                    console.log(error)
                });
                setHola(ts.fullname)
                setFoto1(ts.foto)
        
    }

    const handleSend = e => {
        e.preventDefault();
        socket.emit('message', input, pes)

        //Nuestro mensaje
        const newMessage = {
            media: input,
            usuario: pes
        }

        console.log(newMessage)
        //Añadimos el mensaje y el resto de mensajes enviados
        setMessages([...messages, newMessage])
        //Limpiamos el mensaje
        setMessage('')

        //Petición http por POST para guardar el artículo:
        var consulta = {id:chatAc._id,mensaje:{usuario:pes,media:input,tipo:"texto"}}
                var config_request={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                }
                axios.post('http://localhost:3001/chats2/', consulta, { config_request })
                .then(res => {                                         
                    console.log("bueno")
                })
                .catch((error) => {
                    console.log(error)
                });
        setInput("");
    }
    
    return (
        <div className='mainChats'>
            
            <div className='chats'>
            <IconButton href="/mainmatch">
                <ArrowBackIosIcon fontSize='large' className="header__icon" />
            </IconButton>
                {chats.map(chat => (
                    <div className="chat" onClick={() => doThis(chat)}>
                        <div className="test2">
                        <Avatar className='chat__image' alt={chat.fullname} src={chat.foto}  />
                        <div className="chat__details">
                            <h2>{chat.fullname}</h2>
                        </div>
                        </div>
                    </div>

                ))}
            </div>
            <div>
                {hola
                    ? (<div className="test"><p className="timestamp">Hiciste Match con {hola} el {chatAc.createdAt}</p>
                    {messages.map(message => 
                    message.usuario != pes ? (
                        <div className="message">
                            <Avatar className='image' 
                            alt={message.usuario}
                            src={foto1}  />
                            <p className="text">{message.media}</p>
                        </div> 
                    ) : (
                        <div className="message">
                            <p className="textUser">{message.media}</p>
                        </div>
                    )
                    )}
                        <form className="input" >
                            <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="inputField" 
                            placeholder="Type a message..."
                            type="text" 
                            />
                            <button onClick={handleSend} type="submit" className="inputButton">SEND</button>
                        </form>
                    </div>)
                    : <h3>Bienvenido</h3>
                }
            </div>
        </div>
    )
}

export default Chats