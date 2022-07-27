import React, { useEffect, useState } from 'react'
import Cookies from 'universal-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { Fade } from '@mui/material';
import Sales from './Sales';
import "../styles/MyOffers.css"


export default function MyOffers() {
    const [salesArr, setsalesArr] = useState([]);
    const cookies = new Cookies();
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const [userEmail, setuserEmail] = useState();
    const [userPassword, setuserPassword] = useState();
    const [hide, setHide] = useState(true);
    const [salesAmount, setSalesAmount] = useState(9); //how much sales i want to get from the api

    const [lengthOfItems, setlengthOfItems] = useState(-1);

    useEffect(() => {
        if(cookies.get("emailAccount")===undefined){
            navigate('/signin',{replace: true, state: {comeFromSite: true, path: location.pathname}})
        }
        else{
            setuserEmail(cookies.get("emailAccount").email)
            setuserPassword(cookies.get("emailAccount").password)


            fetch("https://onlineauctionapi.herokuapp.com/myoffers",{
                method:"post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({email: userEmail, password: userPassword, amount: 0})
            })
            
            .then(res=>res.json())
            .then(data=>
                {   
                    console.log(data)

                    if (data.status==="success") {
                        setlengthOfItems(data.message.length)
                    }else if(data.message==="you did not bid on a sale yet"){
                        setlengthOfItems(0)
                    }
                    
                })   
        }   
    }, [userEmail]);

    useEffect(() => { // to check if the cookies is here and set the user details
        if(cookies.get("emailAccount")===undefined){
            navigate('/signin',{replace: true, state: {comeFromSite: true, path: location.pathname}})
        }
        else{
            setuserEmail(cookies.get("emailAccount").email)
            setuserPassword(cookies.get("emailAccount").password)
        }
        
    },);

    useEffect(() => {
        setHide(false)

        fetch("https://onlineauctionapi.herokuapp.com/myoffers",{
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
                    }
                    setHide(true)

                })
    }, [userEmail,salesAmount]);

    const amountOfSales =()=>{
        setSalesAmount(salesAmount+9)
    }



  return (
    <div className='myOffers'>
        <div>
                    <Fade in={hide}>
                    {lengthOfItems===0?<h1>You Don't offer in any sale.</h1>:lengthOfItems>0?<h1>Sales That you offer.</h1>:<div></div>}

                        
                    </Fade>
                    
                    <Sales
                        lengthOfItems={lengthOfItems}
                        salesArr={salesArr}
                        email={userEmail}
                        password={userPassword}
                        hide={hide}
                        amountOfSales={amountOfSales}

                    />
                </div>
    </div>
  )
}
