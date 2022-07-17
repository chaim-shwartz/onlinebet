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

// const PORT_SOCKET = "http://localhost:8000/";
let socket;

// export const initiateSocket = (room) => {
//     socket = io(PORT_SOCKET);
//     console.log(`Connecting socket...`);
//     if (socket && room) socket.emit('join', room);
// }
// export const disconnectSocket = () => {
//     console.log('Disconnecting socket...');
//     if(socket) socket.disconnect();
// }

export default function Chat(props) {
    const cookies = new Cookies();    
    const location = useLocation()
    const [inputMsg, setinputMsg] = useState();
    const [userEmail, setuserEmail] = useState(cookies.get("emailAccount").email);
    
    
    // useEffect(() => {
    //     initiateSocket(props.chatID)
    // }, []);
    const sendMsg=()=>{
        socket.emit("sendMsg", {msg: inputMsg, socketID: socket.id});
    }
    // useEffect(() => {
    //     socket.on('returnSendMsg',(res)=>{
    //         if (res.socketID!==socket.id) {
    //             console.log(res)
    //         }
    //     })
    // }, [PORT_SOCKET]);


    const inputMsgHandleChange = (e) => {
        setinputMsg(e.target.value)
    }



  return (
    <div className='chat'>
        <div className='chatBox'>
            <div className='messages'>
                <YourMsg/>
                <OtherMsg/>
            </div>
            
            <div className='createMsg'>
                <div className="msgInputBox">
                    <form className='msgInput'>
                        <textarea onChange={inputMsgHandleChange} spellCheck="false" rows={1} autoComplete='none' placeholder='Type something...'></textarea>
                        <IconButton onClick={sendMsg} variant="contained"><SendIcon /></IconButton>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
