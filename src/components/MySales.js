import React, { useEffect, useState } from 'react'
import "../styles/mySales.css"
import Cookies from 'universal-cookie';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Button, Fade, styled } from '@mui/material';
import Sales from './Sales';
const CustomButton = styled(Button)(({ theme }) => ({
    // padding:"0.5% 2%",
    margin: "1%",
    border:"0.5px solid #46576d",
    fontSize: 'max(1.7vmin,13px) !important',
    backgroundColor:"#86a3b4", 
    color:"#4a4a4a", 
    fontWeight:"bold", 
    borderRadius:"8px",
    lineHeight:"130%",
    ":hover":{
      backgroundColor:"#46576d",
      color: "#b1b1b1"
      }
  }));


export default function MySales() {
    const navigate = useNavigate(); 
    const location = useLocation(); 
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
  
    const [lengthOfItems, setlengthOfItems] = useState(-1);

    useEffect(() => {
        if(cookies.get("emailAccount")===undefined){
            navigate('/signin',{replace: true, state: {comeFromSite: true, path: location.pathname}})
        }
        else{
            setuserEmail(cookies.get("emailAccount").email)
            setuserPassword(cookies.get("emailAccount").password)


            fetch("https://onlineauctionapi.herokuapp.com/mysales",{
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
                    }else if(data.message==="you did not create a sale yet"){
                        setlengthOfItems(0)
                    }
                    
                })   
        }   
    }, [userEmail]);

    useEffect(() => {
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
        fetch("https://onlineauctionapi.herokuapp.com/mysales",{
                method:"post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({email: userEmail, password: userPassword, amount: salesAmount})
            })
            
            .then(res=>res.json())
            .then(data=>
                {   
                    if (data.status==="success") {
                        setsalesArr(data.message)
                        setHide(true)
                    }
                    else if (data.status==="error") {
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
            if (data.status==='error') {
                alert(data.message)
            }
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
    
    <Fade in><div className='mySales'>
        
            {!showAddDetails?
                <div> 
                    <Fade in={hide}>
                        {lengthOfItems===0?<h1>You Don't create any sale yet.</h1>:lengthOfItems>0?<h1>Your Sales</h1>:<div></div>}   
                    </Fade>
                    {/* <hr/> */}
                    
                    <CustomButton onClick={()=>setshowAddDetails(!showAddDetails)}>Add Sale</CustomButton>
                    
                    <Sales
                        lengthOfItems={lengthOfItems}
                        salesArr={salesArr}
                        email={userEmail}
                        password={userPassword}
                        hide={hide}
                        amountOfSales={amountOfSales}

                    />
        
                   
                </div>
            :
            <Fade in>
                <form className='addDetails'>
                <h1>Add your sale.</h1>
                    <input maxLength={30} name='name' onChange={handleChange} autoComplete="off" autoFocus type="text" placeholder='Name of your pruduct'></input>
                    <p>The image should be close to a 1:1 ratio</p>
                    <input name='image' onChange={handleChange} autoComplete="off" type="url" placeholder='url of image product'></input>
                    <textarea maxLength={200} rows="4" name='description' onChange={handleChange} autoComplete="off" type="text" placeholder='description'></textarea>
                    <input name='price' onChange={handleChange} autoComplete="off" type="number" placeholder='start price'></input>
                    <div className='btns'>
                        <CustomButton type='submit' onClick={addSale}>Add</CustomButton>
                        <CustomButton onClick={(e)=>{setshowAddDetails(!showAddDetails); e.preventDefault()}}>cancel</CustomButton>
                    </div>
                </form>
            </Fade>}
    </div></Fade>
  )
}
