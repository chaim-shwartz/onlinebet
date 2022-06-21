import { Fade, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react'
import "../styles/Sales.css"
import SalePage from './SalePage';

export default function Sales(props) {
    const [salesArr, setsalesArr] = useState([]);
    const [userEmail, setuserEmail] = useState();
    const [userPassword, setuserPassword] = useState();


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
        fetch("https://onlineauctionapi.herokuapp.com/getsale",{
                        method:"post",
                        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                        body: JSON.stringify({email: userEmail, password: userPassword, id: saleid})
                    })
                    
                    .then(res=>res.json())
                    .then(data=>{
                        console.log(data)
                    })
    }



  return (
    <Fade in={salesArr.length!==0}>
        <div className='sales'>
            <div className='salesBox'>
                {salesArr.map((card,index)=>{
                return(
                    <div onClick={()=>clickOnCard(card.saleid)} key={index} className='saleCard'>
                        <div className='saleHeader'>
                            <div className='textH'>
                                <h1>{card.name}</h1>
                            </div>
                            <div className='imgh'>
                            <img src={card.image}></img>
                            </div>
                            
                        </div>
                        <p>{card.details}</p>
                        <div className='likeBtn'>
                            <button onClick={()=>{likeClick(card.saleid, index)}}>
                                {!salesArr[index].saved?<img src={require('../images/heart.png')}/>:
                                <Zoom in={salesArr[index].saved}><img src={require('../images/red-heart.png')}/></Zoom>}
                            </button>
                            
                        </div>
                    </div>
                )
            })}
            </div>
            <Fade in={!props.hide}><h2 hidden={props.hide}>Loading more items...</h2></Fade>
            <Fade in={salesArr.length>0}><button onClick={moreSalesBtn}>Show More</button></Fade>
        </div>
    </Fade>
    
  )
}
