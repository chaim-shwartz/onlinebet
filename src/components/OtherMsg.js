import React from 'react'
import "../styles/msgStyle.css"

export default function OtherMsg(props) {
  return (
    <div>
        <div className='otherMsgContent'>
            <div className='sendName'>
                <p>{props.name}</p>
            </div>
            <div className='otherMsg'>
                <p>{props.content}</p>   
            </div>
            <div className='time'>
                <p>{props.time}</p>
            </div>
        </div>
    </div>
  )
}
