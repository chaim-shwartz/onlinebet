import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/salePage.css"
import { io } from "socket.io-client";
import Chat from './Chat';



export default function SalePage() {
  const [userEmail, setuserEmail] = useState();
  const [userPassword, setuserPassword] = useState();
  const [theSale, setTheSale] = useState({});
  const cookies = new Cookies();
  const navigate = useNavigate(); 
  const { id } = useParams();

  // const socket = io("https://onlineauctionapi.herokuapp.com/");

  useEffect(() => {
    if(cookies.get("emailAccount")===undefined){
        navigate('/signin')
        
    }
    else{
        setuserEmail(cookies.get("emailAccount").email)
        setuserPassword(cookies.get("emailAccount").password)
    }
    
}, );

  useEffect(() => {
    fetch("https://onlineauctionapi.herokuapp.com/getsale",{
                        method:"post",
                        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                        body: JSON.stringify({email: userEmail, password: userPassword, id: id})
                    })
                    
                    .then(res=>res.json())
                    .then(data=>{
                        setTheSale(data.message)
                        console.log(data.message)
                    })
  }, [userEmail]);
  return (
    <div className='salePage'>
      <div className='sale'>

        
        <div className='section1'>
          <div className='image'>
            <img src={theSale.image}/>
          </div>
        <div className='h1_p'>
          <h1>{theSale.name}</h1>
          <hr/>
          <p>{theSale.details}</p>
        </div>
        </div>
        
        <h2>{theSale.high}</h2>



        <hr/>
        {/* <h1>Contact The Seller: {theSale.admin}</h1> */}
      </div>
      <div className='horizontal_hr'></div>
      <div className='theChat'>
        <Chat/>
      </div>

    </div>
  )
}
