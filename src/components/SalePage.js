import { Button, styled } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/salePage.css"
import Chat from './Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import PopUpMessage from './PopUpMessage';

const CustomButton = styled(Button)(({ theme }) => ({
  padding:"0.5% 2%",
  margin: "1%",
  border:"0.5px solid #46576d",
  fontSize: 'max(1.6vmax,15px)',
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




export default function SalePage() {
  const [userEmail, setuserEmail] = useState();  // the user email from cookies
  const [userPassword, setuserPassword] = useState();  // the user password from the cookies
  const [theSale, setTheSale] = useState({}); // the sale that the user get in
  const cookies = new Cookies(); // the cookies
  const navigate = useNavigate(); 
  const { id } = useParams(); // the id of the sale from the url path
  const [newPrice, setNewPrice] = useState(0);  //the price that the user offer
  const [hideTheOffer, sethideTheOffer] = useState(true);// to hide the offer if there is not
  const [ifUserIsAdmin, setifUserIsAdmin] = useState(false);//if user is the admin fo the sale
  const [showPopup, setshowPopup] = useState(false);
  const [popupDetails, setpopupDetails] = useState();
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
                        if (data.message==="I don't recognize this sale") {
                          navigate(-1)
                        }else if (data.status==="success") {
                          setTheSale(data.message)
                        }
                        console.log(data)

                    })
  }, [userEmail]);

  useEffect(() => {
    if (theSale.admin===userEmail&&userEmail!==undefined) {
      console.log(theSale.admin, userEmail)
      setifUserIsAdmin(true)
    }
  }, [theSale]);



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
      sethideTheOffer(false)
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

  const deleteBtn=()=>{
    setpopupDetails({
      title:"Delete a Sale" ,
      explain:"Are you sure you want to delete this sale, After deletion the sale can not be restored.",
      btnName:"Cancel",
      secondBtnName:"Delete",
      navigate:0,
      function: (deleteSale),
    })
    setshowPopup(true)
  }
  const deleteSale = () =>{
    fetch("https://onlineauctionapi.herokuapp.com/remove",{
          method:"post",
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({email: userEmail, password: userPassword, id: id})
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data.message)
          window.location.reload()
    })
  }

  const soldBtn = () =>{
    setpopupDetails({
      title:"Close the Sale" ,
      explain:"Are you sure you want to close this sale, After action the sale can not be reopen.",
      btnName:"Cancel",
      secondBtnName:"Close the sale",
      navigate:0,
      function: (soldSale),
    })
    setshowPopup(true)
  }

  const soldSale =()=>{
    fetch("https://onlineauctionapi.herokuapp.com/sell",{
          method:"post",
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({email: userEmail, password: userPassword, id: id})
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data.message)
          setpopupDetails({
            title:"Sale closed" ,
            explain:data.message,
            btnName:"OK",
            navigate:0,
          })
          // window.location.reload()
    })

  }
  return (
    <div>
      {!showPopup?<div className='salePageOver'>
        {ifUserIsAdmin?<h2>You are the admin of this sale.</h2>:null}
        {theSale.price===undefined?<h2>Loading the sale...</h2>:
        <div className='salePage'>
          
          <div className='sale'>

          {theSale.sold?<img className='soldImg' src={require('../images/soldImg.png')}></img>:null}

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
              <div hidden={ifUserIsAdmin}className='horizontal_hr'></div>
              <hr/>


              {!ifUserIsAdmin&&!theSale.sold?<div className='offer'>
                <h2>Want to offer more?</h2>
                <CustomButton onClick={()=>offerMore(10)}>+10$</CustomButton>
                <CustomButton onClick={()=>offerMore(20)}>+20$</CustomButton>
                <CustomButton onClick={()=>offerMore(50)}>+50$</CustomButton>
                <CustomButton onClick={()=>offerMore(100)}>+100$</CustomButton>
                <br/>
                <input onChange={handleChangeInput} type="number" min={theSale.price+10} placeholder="Your offer"></input>

                {newPrice!==0?
                <div>
                  <h2 hidden={hideTheOffer}>Your Offer: {newPrice}$</h2>
                  <CustomButton disabled={hideTheOffer} onClick={sendOffer}>Offer!</CustomButton>
                </div>:
                <h2>You need to offer a better price.</h2>}

                

              </div>:
              ifUserIsAdmin&&!theSale.sold?<div className='soldBtn'>
              <h2>Do you want to close the sale?</h2>
              <CustomButton onClick={soldBtn} sx={
                {
                  // lineHeight:"1.75",
                  ":hover":{
                    backgroundColor:"#698a5e",
                    color: "#3a3a3a",
                    }
                }
                }variant="contained"
                >

                Close the sale

              </CustomButton>
              </div>:null}


              
            </div>
            
            <hr/>

            {ifUserIsAdmin?<div>
              <Button onClick={deleteBtn} sx={
                {
                  margin: "2%",
                  backgroundColor:"#86a3b4", 
                  color:"#4a4a4a", 
                  fontWeight:"bold", 
                  borderRadius:"8px",
                  ":hover":{
                    backgroundColor:"#B22222",
                    color: "#b1b1b1"
                    }
                }
                }variant="contained" startIcon={<DeleteIcon />}
                >

                Delete this sale

              </Button>
              </div>:null}

            
            {/* <h1>Contact The Seller: {theSale.admin}</h1> */}
          </div>
          <div className='horizontal_hr'></div>
          <div className='theChat'>
            <Chat/>
          </div>

        </div>}

        
      </div>:
      
      <PopUpMessage 
              title={popupDetails.title} 
              explain={popupDetails.explain}
              btnName={popupDetails.btnName}
              secondBtnName={popupDetails.secondBtnName}
              navigate={popupDetails.navigate}
              function={popupDetails.function}
              />}
    </div>
    
  )
}
