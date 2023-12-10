"use client"

import axios from 'axios'
import React, {useState, useEffect} from 'react'
import TinderCard from 'react-tinder-card'
import { useSession,getSession } from "next-auth/react"
import "./TinderCards.css"
import ForumIcon from '@material-ui/icons/Forum';
import IconButton from '@material-ui/core/IconButton';



function TinderCards() {
    const [people, setPeople] = useState([]);
    const [pes, setPes] = useState('');


    useEffect(() => {
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
                axios.post('http://localhost:3001/posiblesMatchs2', consulta, { config_request })
                .then(res => {                                         
                    setPeople(res.data)
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
                axios.get('http://localhost:3001/posiblesMatchs/'+test._id).then(res => {                                         
                    setPeople(res.data)
                    console.log(session.user.image._id)
                })
                .catch((error) => {
                    console.log(error)
                });
            }
            
            }
            myFunction() 
    }, [])
    
    const swiped = (direction, nameToDelete) => {
        console.log("removing: " + nameToDelete);
        if(direction == "left"){
            console.log("left")
        }else if(direction =="right"){
            console.log(pes)
            var consulta = {usuario1: pes,usuario2:nameToDelete,estado:'Aceptado'}
                var config_request={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                }
            axios.post('http://localhost:3001/matchs', consulta, { config_request })
                .then(res => {                                         
                    console.log("bien")
                })
                .catch((error) => {
                    console.log(error)
                });
        }

    };

    const outOfFrame = (name) => {
        console.log(name + "left the screen");
    };

console.log(people);

    return (
        <div className="tinderCards">
            <IconButton href="/chat">
                <ForumIcon fontSize='large' className="header__icon" />
            </IconButton>
            <div className="tinderCards__cardContainer">
            {people.map(person =>(
            <TinderCard 
                className="swipe"
                key={person.fullname}
                preventSwipe={["up","down"]}
                onSwipe={(dir)=> swiped(dir, person._id)}
                onCardLeftScreen={()=> outOfFrame(person.fullname)}
                
            >
                <div style={{background:"url(" + person.galeria[0] + ")", backgroundSize: "100%"}}
                className="card">
                <div class="test">
                <h3>{person.fullname}</h3>
                <h3>{person.genero}</h3>
                </div>
                </div>
            </TinderCard>
            ))}

            </div>
        </div>
    )
}

export default TinderCards
