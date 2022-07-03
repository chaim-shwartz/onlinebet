import React, { useState } from 'react'
import '../styles/chat.css'
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/SendRounded';
import YourMsg from './YourMsg';
import OtherMsg from './OtherMsg';
import { io } from "socket.io-client";




export default function Chat() {
    const [inputMsg, setinputMsg] = useState();
    // const socket = io("http://localhost:8000/");


    const inputMsgHandleChange = (e) => {
        setinputMsg(e.target.value)
    }

    const sendMsg=()=>{
        // socket.emit("sendMsg", inputMsg);
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
