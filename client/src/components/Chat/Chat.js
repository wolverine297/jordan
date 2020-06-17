import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({location}) => {
    const [name,setname] = useState('');
    const [room,setroom] = useState('');
    const [message,setmessage] = useState('');
    const [messages,setmessages] = useState([]);
    const [users, setUsers] = useState('');
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const {name,room} = queryString.parse(location.search);
        socket = io(ENDPOINT);

        setname(name);
        setroom(room);

        socket.emit('join',{name,room},() => {
        });
        return() => {
        socket.emit('disconnect');
        socket.off();
        }
    },[ENDPOINT,location.search]);
    useEffect(() => {
     socket.on('message',(message) => {
         setmessages([...messages,message]);
     });
     socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
     },[messages]);

     const sendMessage = (event) => {
         event.preventDefault();
         if(message){
             socket.emit('sendMessage',message,() => setmessage(''));
         }
     }
     console.log(message,messages);
    
    return (
        <div className="outerContainer">
      <div className="container">
        <InfoBar room = {room}/>
        <Messages messages = {messages} name={name}/>
        <Input message = {message} setmessage = {setmessage} sendMessage = {sendMessage} />
        </div>
        <TextContainer users={users}/>
        </div>
    )
}
export default Chat;