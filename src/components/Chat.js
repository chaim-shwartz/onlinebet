import React from 'react'
import '../styles/chat.css'
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/SendRounded';
import YourMsg from './YourMsg';
import OtherMsg from './OtherMsg';




export default function Chat() {
  return (
    <div>
        <div className='chatBox'>
            <div className='messages'>
                <YourMsg/>
                <OtherMsg/>
            </div>
            
            <div className='createMsg'>
                <div className="msgInputBox">
                    <form className='msgInput'>
                        <textarea spellCheck="false" rows={1} autoComplete='none' placeholder='Type something...'></textarea>
                        <IconButton variant="contained"><SendIcon /></IconButton>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
