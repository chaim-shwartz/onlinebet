import React, { useEffect, useState } from 'react'
import "../styles/salesHomepage.css"
import Cookies from 'universal-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fade, Zoom } from '@mui/material';
import Sales from './Sales'



export default function SalesHomepage() {
    const cookies = new Cookies();
    const [userEmail, setuserEmail] = useState();
    const [userPassword, setuserPassword] = useState();
    const [hide, setHide] = useState(true);
    const [salesArr, setsalesArr] = useState([]);
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const [salesAmount, setSalesAmount] = useState(9); //how much sales i want to get from the api



    useEffect(() => {
        //to check if there is no cookies and then go to login page
        if(cookies.get("emailAccount")===undefined){
            navigate('/signin',{replace: true, state: {comeFromSite: true, path: location.pathname}})
        }
        else{
            setuserEmail(cookies.get("emailAccount").email)
            setuserPassword(cookies.get("emailAccount").password)
        
            setHide(false)
            fetch("https://onlineauctionapi.herokuapp.com/getsales",{
                method:"post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({email: userEmail, password: userPassword, amount: salesAmount})
            })
            
            .then(res=>res.json())
            .then(data=>
                {   
                    // console.log(data)
                    if (data.status==="success") {
                        setsalesArr(data.message)
                        setHide(true)
                    }
                    
                })
                
            }
            // console.log(salesArr)
    },[userEmail,salesAmount]);
    
    const amountOfSales =()=>{
        setSalesAmount(salesAmount+9)
    }

  return (
    <div className='salesHomePage'>
        <Sales
            salesArr={salesArr}
            email={userEmail}
            password={userPassword}
            amountOfSales={amountOfSales}
            hide={hide}
        />
        


    </div>
    
  )
}
