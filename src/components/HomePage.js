import React, { useEffect } from 'react'
import Chat from './Chat'
import '../styles/HomePage.css'
import SalesHomepage from './SalesHomepage'
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
  const cookies = new Cookies();
  const navigate = useNavigate(); 



  useEffect(() => {  //to check if there is no cookies and then go to login page
    if(cookies.get("emailAccount")===undefined){
      // alert("ksdjfh")
      navigate('/signin')
    }
  },);

  return (
    <div className='home'>
        <SalesHomepage/>
        {/* <Chat/> */}
    </div>
  )
}
