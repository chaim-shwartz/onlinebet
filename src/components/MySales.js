import React, { useEffect, useState } from 'react'
import "../styles/mySales.css"
import Cookies from 'universal-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

import { Fade } from '@mui/material';
import Sales from './Sales';



export default function MySales() {
    const navigate = useNavigate(); 

    const [salesAmount, setSalesAmount] = useState(9); //how much sales i want to get from the api
    const cookies = new Cookies();
    const [userEmail, setuserEmail] = useState();
    const [userPassword, setuserPassword] = useState();
    const [showAddDetails, setshowAddDetails] = useState(false);
    const [hide, setHide] = useState(true);
    const [salesArr, setsalesArr] = useState([]);
    const [saleDetails, setsaleDetails] = useState({
        name: "",
        image: "",
        description: "",
        price: ""
    });
  
    // console.log(userEmail)

    useEffect(() => {
        if(cookies.get("emailAccount")===undefined){
            navigate('/signin')
            
        }
        else{
            setuserEmail(cookies.get("emailAccount").email)
            setuserPassword(cookies.get("emailAccount").password)
        }
        
    },);

    useEffect(() => {

        setHide(false)
        fetch("https://onlineauctionapi.herokuapp.com/mysales",{
                method:"post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({email: userEmail, password: userPassword, amount: salesAmount})
            })
            
            .then(res=>res.json())
            .then(data=>
                {   
                    console.log(data)
                    if (data.status==="success") {
                        setsalesArr(data.message)
                        setHide(true)
                    }
                    
                })
                
            
        
    }, [userEmail,salesAmount]);
  
    const addSale = (e) => {
        e.preventDefault()
        

        
        fetch(("https://onlineauctionapi.herokuapp.com/sales"),{
            method: "post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({admin: userEmail, password: userPassword, image: saleDetails.image, details: saleDetails.description, price: saleDetails.price, name: saleDetails.name})
        })
        
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            // alert(data.status)
            setshowAddDetails(!showAddDetails)
            window.location.reload()
        })   
    }

    const handleChange = (event) => {
        // console.log(saleDetails)
        setsaleDetails((prev)=>({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
  
    const amountOfSales =()=>{
        setSalesAmount(salesAmount+9)
    }

  
    return (
    <div className='mySales'>
        
            {!showAddDetails?
                <div>
                    <Fade in={hide}>
                        <h1>Your Sales</h1>
                    </Fade>
                    
                    <Sales
                        salesArr={salesArr}
                        email={userEmail}
                        password={userPassword}
                        hide={hide}
                        amountOfSales={amountOfSales}

                    />
        
                    <Fade in>
                        <button onClick={()=>setshowAddDetails(!showAddDetails)}>Add Sale</button>
                    </Fade>
                </div>
            :
            <Fade in>
                <form className='addDetails'>
                <button onClick={()=>setshowAddDetails(!showAddDetails)}>cancel</button>
                <h1>Add your sale.</h1>
                    <input maxLength={30} name='name' onChange={handleChange} autoComplete="off" autoFocus type="text" placeholder='Name of your pruduct'></input>
                    <input name='image' onChange={handleChange} autoComplete="off" type="url" placeholder='url of image product'></input>
                    <textarea maxLength={200} rows="4" name='description' onChange={handleChange} autoComplete="off" type="text" placeholder='description'></textarea>
                    <input name='price' onChange={handleChange} autoComplete="off" type="number" placeholder='start price'></input>
                    <button type='submit' onClick={addSale}>Add</button>
                </form>
            </Fade>}
    </div>
  )
}
