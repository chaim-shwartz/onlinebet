import { Fade, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Sales.css"
import "../images/soldImg.png"

export default function Sales(props) {
    const [salesArr, setsalesArr] = useState([]);
    const [userEmail, setuserEmail] = useState();
    const [userPassword, setuserPassword] = useState();
    const navigate = useNavigate()


    useEffect(() => {
        setsalesArr(props.salesArr)
        setuserEmail(props.email)
        setuserPassword(props.password)
    }, [props]);
    console.log(userEmail)




    const likeClick=(saleid,index)=>{
        
        setsalesArr(
            [...salesArr],
            salesArr[index].saved = !salesArr[index].saved
        )
        console.log(salesArr)
        fetch("https://onlineauctionapi.herokuapp.com/like",{
                method:"post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                body: JSON.stringify({email: userEmail, password: userPassword, id: saleid, like: salesArr[index].saved})
            })
            
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
            })
        
    }

    const moreSalesBtn =()=>{
        props.amountOfSales()
    }


    const clickOnCard=(saleid)=>{  // the function when you click on the sale to see the details
        console.log(saleid)
        navigate("/salepage/"+saleid)
        
    }



  return (
    <div>
        <h2 hidden={props.hide}>Loading your items...</h2>

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
                                    <p>{card.details}</p>
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
                    <Fade in={!props.hide}><h2 hidden={props.hide}>Loading more items...</h2></Fade>
                    <Fade in={salesArr.length>0}><button onClick={moreSalesBtn}>Show More</button></Fade>
                </div>
            </Fade>
        </div>
    
    
  )
}
