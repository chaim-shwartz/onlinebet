import React, { useEffect, useState } from 'react'
import '../styles/chat.css'
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/SendRounded';
import YourMsg from './YourMsg';
import OtherMsg from './OtherMsg';
import { io } from "socket.io-client";
import Cookies from 'universal-cookie';

import { useBeforeunload } from 'react-beforeunload';
import { useLocation } from 'react-router-dom';
import { Fade } from '@mui/material';

const PORT_SOCKET = "https://onlinebet.herokuapp.com";
let socket;


export const initiateSocket = (room) => {
    socket = io(PORT_SOCKET);
    // console.log(`Connecting socket...`);
    if (socket && room) socket.emit('join', room);
}
export const disconnectSocket = () => {
    // console.log('Disconnecting socket...');
    if(socket) socket.disconnect();
}

export default function Chat(props) {
    
    
    const date = new Date();
    const cookies = new Cookies(); 
    const [firstTime, setfirstTime] = useState(true);   
    const location = useLocation()
    const [inputMsg, setinputMsg] = useState("");
    const [userEmail, setuserEmail] = useState(cookies.get("emailAccount").email);
    const [userName, setuserName] = useState(cookies.get("emailAccount").fname+" "+cookies.get("emailAccount").lname);
    const [userPassword, setuserPassword] = useState(cookies.get("emailAccount").password);
    const [message, setmessage] = useState();
    const [DBarray, setDBarray] = useState([]);
    const [localArray, setlocalArrary] = useState([]);
    const [disabledSendBtn, setdisabledSendBtn] = useState(true);
    
    useEffect(() => {
       if (firstTime) {
        disconnectSocket()
        setfirstTime(false)
       }
    }, [firstTime]);
    useEffect(() => {
        initiateSocket(props.chatID)

        fetch("https://onlineauctionapi.herokuapp.com/getchat",{
            method:"post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: userEmail, password: userPassword, id: props.chatID})
        })
        
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
            setDBarray(data.message)
            if (data.status==='error') {
                alert(data.message)
            }
        })
    }, []);

    useEffect(() => {
        updateScroll()
    }, [localArray]);
    useEffect(() => {
        var element = document.getElementById("divscroll");
        element.scrollTop = element.scrollHeight;
    }, [DBarray]);



    const sendMsg = (e) => {
        e.preventDefault();
        socket.emit("sendMsg", {msg: {email: userEmail, name: userName, content: message.content, time: date.getHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes()}, socketID: socket.id});
        setlocalArrary(prev=>
            [...prev,
            {email: userEmail, name: userName ,content: message.content, time: date.getHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes()}]
        )
        fetch("https://onlineauctionapi.herokuapp.com/message",{
            method:"post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: userEmail, password: userPassword, id: props.chatID,time: date.getHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes(),content:message.content})
        })
        
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
            if (data.status==='error') {
                alert(data.message)
            }
        })
        
        setinputMsg('')
        setmessage()
    }




    useEffect(() => {
        socket.on('returnSendMsg',(res)=>{
            if (res.msg.email!==userEmail) {
                setlocalArrary(prev=>
                    [...prev,
                    {name: res.msg.name ,content: res.msg.content, time:res.msg.time}]
                )
            }
            console.log(res) 
        })
    }, [PORT_SOCKET]);
                
    // console.log(localArray)



    const inputMsgHandleChange = (e) => {
        setinputMsg(e.target.value)
        setmessage(prev=>({
            ...prev,
            content: e.target.value,
        }))
        
    }

    useEffect(() => {
        if (inputMsg.trim().length === 0) {
            setdisabledSendBtn(true)
        } else {
            setdisabledSendBtn(false)
        }
    }, [inputMsg]);


    function updateScroll(){//scroll to the last message
        var element = document.getElementById("divscroll");
        // element.scrollTop = element.scrollHeight;
        element.scrollTo({
            top: element.scrollHeight,
            left: 0,
            behavior: "smooth",
          });
    }

  return (
    <div className='chat'>
        <div className='chatHead'>
            <h2>Chat</h2>
        </div>
        <div className='chatBoxOver'>
            <div className='chatBox'>
                <Fade in><div id='divscroll' className='messages'>
                    {DBarray.map((msg,index)=>{
                        if(msg.who===userEmail){
                        return(
                            <YourMsg key={index} content={msg.content} time={msg.time}/>
                        )
                        }else{
                            return(
                                <OtherMsg key={index} name={msg.name} content={msg.content} time={msg.time}/>

                            )
                        }
                        
                    })}
                    {localArray.map((msg,index)=>{
                        if(msg.email===userEmail){
                            console.log('yes')
                        return(
                            <YourMsg key={index} content={msg.content} time={msg.time}/>
                        )
                        }else{
                            return(
                                <OtherMsg key={index} name={msg.name} content={msg.content} time={msg.time}/>

                            )
                        }
                        
                    })}
                    
                </div></Fade>
                
            </div>
            <div className='createMsg'>
                <div className="msgInputBox">
                    <form className='msgInput'>
                        <input type='text' value={inputMsg} onChange={inputMsgHandleChange} spellCheck="false" autoComplete='none' placeholder='Type something...'></input>
                        <IconButton style={{color: "#58734f"}} disabled={disabledSendBtn} type='submit' onClick={sendMsg} variant="contained"><SendIcon /></IconButton>
                    </form>
                </div>
            </div>
        </div>
        
    </div>
  )
}
