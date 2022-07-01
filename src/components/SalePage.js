import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/salePage.css"
import Chat from './Chat';



export default function SalePage() {
  const [userEmail, setuserEmail] = useState();  // the user email from cookies
  const [userPassword, setuserPassword] = useState();  // the user password from the cookies
  const [theSale, setTheSale] = useState({}); // the sale that the user get in
  const cookies = new Cookies(); // the cookies
  const navigate = useNavigate(); 
  const { id } = useParams(); // the id of the sale from the url path
  const [newPrice, setNewPrice] = useState(0);  //the price that the user offer
  const [hideTheOffer, sethideThOffer] = useState(true);// to hide the offer if there is not


  useEffect(() => {  // the function that check that there is cookies and set the user details
    if(cookies.get("emailAccount")===undefined){
        navigate('/signin')
        
    }
    else{
        setuserEmail(cookies.get("emailAccount").email)
        setuserPassword(cookies.get("emailAccount").password)
    }
    
}, );


  useEffect(() => {  // the function that get the sale from the DB 
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



  const offerMore=(addPrice)=>{  // the function that show the user the price that he is offer
      setNewPrice(theSale.price+addPrice)
  }

  const handleChangeInput=(e)=>{ // this function set the new price from the custom user input
    console.log(e.target.value)
    if (e.target.value>=theSale.price+10) {
      setNewPrice(e.target.value)
    }
    else{ // to hide the offer if its low from the current price we change it to 0
      setNewPrice(0)
    }
  }

  useEffect(() => { // this function is to toggle the hide offer 
    if (newPrice!==0) {
      sethideThOffer(false)
    }
  }, [newPrice]);
  

  const sendOffer=()=>{ // this is the function that send a offer to the DB
    fetch("https://onlineauctionapi.herokuapp.com/bid",{
          method:"post",
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({email: userEmail, password: userPassword, id: id, price: newPrice})
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data.message)
          window.location.reload()
    })
    setNewPrice(0)
  }




  return (
    <div className='salePageOver'>
      {theSale.price===undefined?<h2>Loading the sale...</h2>:
      <div className='salePage'>
        
        <div className='sale'>

          
          <div className='section1'>
            <div className='image'>
              <img src={theSale.image}/>
            </div>
          <div className='h1_p'>
            <h1>{theSale.name}</h1>
            {/* <hr/> */}
            <p><b>Details:</b> {theSale.details}</p>
          </div>
          </div>
          <hr/>
          <div className='details'>

            <div className='price'>
              <h1>{theSale.price}$</h1>
              
              <h2>The best offer by: {theSale.high}</h2>
            </div>
            <div className='horizontal_hr'></div>


            <div className='offer'>
              <h2>Want to offer more?</h2>
              <button onClick={()=>offerMore(10)}>+10$</button>
              <button onClick={()=>offerMore(20)}>+20$</button>
              <button onClick={()=>offerMore(50)}>+50$</button>
              <button onClick={()=>offerMore(100)}>+100$</button>
              <br/>
              <input onChange={handleChangeInput} type="number" min={theSale.price+10} placeholder="Your offer"></input>

              {newPrice!==0?
              <div>
                <h2 hidden={hideTheOffer}>Your Offer: {newPrice}$</h2>
                <button onClick={sendOffer} hidden={hideTheOffer}>Offer!</button>
              </div>:
              <h2>You need to offer a better price.</h2>}

              

            </div>
          </div>
            



          
          {/* <h1>Contact The Seller: {theSale.admin}</h1> */}
        </div>
        <div className='horizontal_hr'></div>
        <div className='theChat'>
          <Chat/>
        </div>

      </div>}
    </div>
  )
}
