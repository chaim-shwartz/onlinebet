import React from 'react';
import "../styles/msgStyle.css"

const YourMsg = (props) => {
    return (
        <div>
            <div className='yourMsgContent'>
                <div className='yourMsg'>
                    <p>{props.content}</p>   
                </div>
                <div className='time'>
                    <p>{props.time}</p>
                </div>
            </div>

        </div>
    );
}

export default YourMsg;
