import { Button, Fade, styled, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Sales.css"
import "../images/soldImg.png"
import {DisappearedLoading} from 'react-loadingg'

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

export default function Sales(props) {
    const [salesArr, setsalesArr] = useState([]);
    const [userEmail, setuserEmail] = useState();
    const [userPassword, setuserPassword] = useState();
    const navigate = useNavigate()
    const [lengthOfItems, setlengthOfItems] = useState();

    useEffect(() => {
        setsalesArr(props.salesArr)
        setuserEmail(props.email)
        setuserPassword(props.password)
        setlengthOfItems(props.lengthOfItems)
    }, [props]);




    const likeClick=(saleid,index)=>{//the like btn
        
        setsalesArr(
            [...salesArr],
            salesArr[index].saved = !salesArr[index].saved
        )
        fetch("https://onlineauctionapi.herokuapp.com/like",{
                method:"post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({email: userEmail, password: userPassword, id: saleid, like: salesArr[index].saved})
            })
            
            .then(res=>res.json())
            .then(data=>{
                // console.log(data)
            })
        
    }

    const moreSalesBtn =()=>{
        props.amountOfSales()
    }


    const clickOnCard=(saleid)=>{  // the function when you click on the sale to see the details
        navigate("/salepage/"+saleid)
    }


  return (
    <div>
        {/* <h2 hidden={props.hide}>Loading your items...</h2> */}
        
        <Fade in={salesArr.length!==0}>
                <div className='sales'>
                    <div className='salesBox'>
                        {salesArr.map((card,index)=>{
                        return(
                            <div key={index} className='saleCard'>
                                <div onClick={()=>clickOnCard(card.saleid)} style={{height:"100%", marginBottom:"30px",display: "grid"}}>
                                {card.sold?<img className='soldImg' src={require('../images/soldImg.png')}></img>:null}

                                    <div className='saleHeader'>
                                        <div className='textH'>
                                            <h1>{card.name}</h1>
                                        </div>
                                        <div className='imgh'>
                                            <img src={card.image}></img>
                                        </div>
                                        
                                    </div>
                                    <h5>{card.details}</h5>
                                </div>
                                    
                                <div className='likeBtn'>
                                <p onClick={()=>clickOnCard(card.saleid)}>price: {card.price}$</p>
                                    <button onClick={()=>{likeClick(card.saleid, index)}}>
                                        {!salesArr[index].saved?<Fade in><img src={require('../images/heart.png')}/></Fade>:
                                        <Zoom in={salesArr[index].saved}><img src={require('../images/red-heart.png')}/></Zoom>}
                                    </button>
                                    
                                </div>
                                
                                {card.admin===userEmail?<div><hr/><h6>You are the admin of the sale.</h6></div>:null}
                            </div>
                        )
                    })}
                    </div>
                    {lengthOfItems>salesArr.length?<CustomButton hidden={!salesArr.length>0} onClick={moreSalesBtn}>Show More</CustomButton>:<p>No more items.</p>}
                </div>
            </Fade>
            {/* <Fade in={!props.hide}><h2>Loading items...</h2></Fade> */}
           {!props.hide?<DisappearedLoading style={{margin:"auto"}} color='#5a7e90'/>:null}
            {salesArr.length===0?<div style={{height: '30vh'}}></div>:null}

        </div>
    
    
  )
}
