import { Button, Fade, styled } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/PopUpMessage.css"

const CustomButton = styled(Button)(({ theme }) => ({
  // padding:"0.5% 2%",
  // margin: "0 1%",
  margin: '5px',
  border:"0.5px solid #46576d",
  // fontSize: 'max(1.6vmax,15px)',
  backgroundColor:"#86a3b4", 
  color:"#4a4a4a", 
  fontWeight:"bold", 
  borderRadius:"8px",
  ":hover":{
    backgroundColor:"#46576d",
    color: "#b1b1b1"
    }
}));

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
                  <CustomButton onClick={continueBtn}>{props.btnName}</CustomButton>
                  {props.secondBtnName?<CustomButton onClick={secondBtn}>{props.secondBtnName}</CustomButton>:null}
                </div>
      </div>
    </Fade>
    
  )
}
