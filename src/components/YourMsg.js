import React from 'react';
import ReactLinkify from 'react-linkify';
import "../styles/msgStyle.css"

const YourMsg = (props) => {
    const currentT = new Date()
    currentT.getDate()
    const time = new Date(props.time);

    var showTime =  time.getHours()+":"+(time.getMinutes()<10?'0':'') + time.getMinutes()
    if (currentT.getFullYear()!==time.getFullYear()) {
        showTime = time.getDate()+"/"+(time.getMonth()+1)+"/"+time.getFullYear() +" "+ showTime
    }else{
        if (currentT.getMonth()!==time.getMonth()) {
            showTime = time.getDate()+"/"+(time.getMonth()+1) +" "+ showTime
        }else{
            if ((currentT.getDate())!==(time.getDate())) {
                if ((currentT.getDate()-1)===time.getDate()) {
                    showTime = "Yesterday at " +showTime
                }else{
                    showTime = time.getDate()+"/"+(time.getMonth()+1) +" "+ showTime
                }
            }
            else if (currentT.getHours()!==time.getHours()) {
                if (currentT.getHours()>(time.getHours()+1)) {
                    showTime = "Today at " +showTime
                }
            }else if(currentT.getMinutes()===time.getMinutes()){
                showTime = "Now"
            }
        }   
    
    }
    
    

    

    return (
        <div>
            <div className='yourMsgContent'>
                <div className='yourMsg'>
                <ReactLinkify  componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="blank" href={decoratedHref} key={key}>
                    {decoratedText}
                </a>
            )}>{props.content}</ReactLinkify>
                </div>
                <div className='time'>
                    <p>{showTime}</p>
                </div>
            </div>
        </div>
    );
}

export default YourMsg;
