import React, { useEffect, useState } from 'react'
import "../styles/header.css"
import Avatar from '@mui/material/Avatar';
import { Button, Fade, IconButton } from '@mui/material';
import { red } from '@mui/material/colors';
import { useTheme } from 'styled-components';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import Cookies from 'universal-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import Notifications, {notify} from 'react-notify-toast';


export default function Header() {
    const [navWidth, setnavWidth] = useState("0%");
    const [hidenav, sethidenav] = useState(true);
    const [ThereIsCookies, setThereIsCookies] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const cookies = new Cookies();
    const [userInformation, setuserInformation] = useState({});
    const location = useLocation()
    const navigate = useNavigate()


    useEffect(() => {
      if (cookies.get("emailAccount")!==undefined) {
        setuserInformation({
          fname:cookies.get("emailAccount").fname,
          lname:cookies.get("emailAccount").lname,
          email:cookies.get("emailAccount").email,
          password:cookies.get("emailAccount").password,
          firstChar: (cookies.get("emailAccount").fname).charAt(0).toUpperCase()
        })
      } 
    },[location]);


    function clickMenu() {  
        sethidenav(!hidenav)
        if (navWidth==="0%") {
            setnavWidth("75%")
        } else {
            setnavWidth("0%")
        }
    }
    useEffect(() => {
     if (cookies.get("emailAccount")!==undefined) {
       setThereIsCookies(true)
      }
      else{
        setThereIsCookies(false)

      }
      console.log(location)
    },[location]);
    
    const mouseLeaveTheHeader=()=>{
      if (showProfileMenu) {
        setShowProfileMenu(false)
      }
    }
    const profileBtn = () => {
      setShowProfileMenu(!showProfileMenu)
    }
    
    const SignOutBtn = () =>{
      cookies.remove("emailAccount", { path: '/' })
      navigate('/signin')
      notify.show("You're logged out.", "warning", 6000);

    }

    const clickOnAuction=()=>{
      navigate("/")
      window.location.reload()
    }
    

  return (
    <div>
      <div hidden={!ThereIsCookies} onMouseLeave={mouseLeaveTheHeader} className='header'>
        {/* {true?<h1></h1>:null} */}
        <header className="head">
        <div className='profile'>
          <div className='profileBtn'>
              <Button onClick={profileBtn} sx={ {backgroundColor:"#86a3b4",width:"100%",height:"100%",minWidth:"0",borderRadius: 100 ,":hover":{bgcolor:"#46576d"} } }><p>{userInformation.firstChar}</p></Button>
          </div>
          <Fade in={showProfileMenu}>
          <div className='profileMenu'>
              <h2>{userInformation.fname} {userInformation.lname}</h2>
                  <button>Edit Profile</button>
                  <button onClick={SignOutBtn}>Sign Out</button>
            </div>
          </Fade>
            
        </div>

        <h1 onClick={clickOnAuction} className='headerH1'>Auction</h1>

        <div className='mLinks'>
            {/* <a>my profile</a>| */}
            <a href='/'>Home</a>|
            <a href='/mysales'>My sales</a>|
            <a href='/myoffers'>My offers</a>|
            <a href='/mylikes'>My likes</a>
        </div>

        <div className='profile'><div className='profileBtn'></div></div>

      </header>
      <header className="headResponsive">
      <div className='profile'>
          <div className='profileBtn'>
              <Button onClick={profileBtn} sx={ {backgroundColor:"#86a3b4",width:"100%",height:"100%",minWidth:"0",borderRadius: 100 ,":hover":{bgcolor:"#46576d"} } }><p>{userInformation.firstChar}</p></Button>
          </div>
          <Fade in={showProfileMenu}>
          <div className='profileMenu'>
              <h2>{userInformation.fname} {userInformation.lname}</h2>
                  <button>Edit Profile</button>
                  <button onClick={SignOutBtn}>Sign Out</button>
            </div>
          </Fade>
            
        </div>

        <h1 onClick={clickOnAuction}>Auction</h1>

        <div className='menuBtn'>
        <IconButton sx={{padding: "0 !important"}} onClick={clickMenu}><MenuTwoToneIcon sx={{ color: '#86a3b4'}}/></IconButton>
        </div>
        
      </header>
      {!hidenav?<div onClick={clickMenu} className='toHide'></div>:null}
      <div style={{width: navWidth}} className='menuPhoneBox'>
        <div className='menuPhone'>
          <div className='headSection'>
              <h2>Menu</h2>
              <IconButton sx={{padding: "0 !important"}}  onClick={clickMenu}><ClearIcon sx={{ color: '#282c34'}}/></IconButton>
          </div>
          {/* <button>My profile</button> */}
          <button><a href='/'>Home</a></button>
          <button><a href='/mysales'>My sales</a></button>
          <button><a href='/myoffers'>My offers</a></button>
          <button><a href='/mylikes'>My likes</a></button>
        </div>
      </div>
    </div>
    <div hidden={ThereIsCookies}>
      <header className="headNoProfile">
        <h1>Welcome To Auction</h1>
      </header>
    </div>
      
  </div>
    
  )
}
