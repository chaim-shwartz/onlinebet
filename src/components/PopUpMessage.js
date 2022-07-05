import { Fade } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/PopUpMessage.css"

export default function PopUpMessage(props) {
    const navigate = useNavigate(); 


    const continueBtn=()=>{// the button in the pop up window for going to login
      if (props.navigate!==undefined) {
        navigate(props.navigate);
      }
      if (props.refresh) {
        window.location.reload();
      }
    }

    const secondBtn = () =>{
        props.function()
    }



  return (
    <Fade in>
      <div className="popWindow">
        <h1>{props.title}</h1>
                <hr/>
                <p>{props.explain}</p>
                <div className='btns'>
                  <button onClick={continueBtn}>{props.btnName}</button>
                  {props.secondBtnName?<button onClick={secondBtn}>{props.secondBtnName}</button>:null}
                </div>
      </div>
    </Fade>
    
  )
}
