import React, { useEffect, useState } from 'react'
import "../styles/header.css"
import Avatar from '@mui/material/Avatar';
import { Button, Fade, IconButton, styled} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import Cookies from 'universal-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import Notifications, {notify} from 'react-notify-toast';
const MenuButton = styled(Button)(({ theme }) => ({
  fontSize: "max(1.6vmax,20px)",

    padding:"0",
    margin: "3% 2%",
    backgroundColor:"#86a3b4", 
    color:"#4a4a4a", 
    fontWeight:"bold", 
    borderRadius:"8px",
    ":hover":{
      backgroundColor:"#46576d",
      color: "#b1b1b1"
      }
}));

const CustomButton = styled(Button)(({ theme }) => ({
  // padding:"0.5% 2%",
  margin: "2% 0%",
  border:"0.5px solid #46576d",
  fontSize: 'max(1.5vw,15px)',
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
      setShowProfileMenu(false)
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
    navigate('/signin',{state: {comeFromSite: true}})
    notify.show("You're logged out.", "warning", 4000);

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
                  <CustomButton onClick={()=>{navigate('/editprofile');setShowProfileMenu(false)}}>Edit Profile</CustomButton>
                  <CustomButton onClick={SignOutBtn}>Sign Out</CustomButton>
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
                  <CustomButton onClick={()=>{navigate('/editprofile');setShowProfileMenu(false)}}>Edit Profile</CustomButton>
                  <CustomButton onClick={SignOutBtn}>Sign Out</CustomButton>
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
              <Button sx={{backgroundColor:"#86a3b4",minWidth:"0",borderRadius:"8px"}}  onClick={clickMenu}><ClearIcon sx={{ color: '#282c34'}}/></Button>
          </div>
          <MenuButton onClick={()=>{navigate('/');clickMenu()}}>Home</MenuButton>
          <MenuButton onClick={()=>{navigate('/mysales');clickMenu()}}>My sales</MenuButton>
          <MenuButton onClick={()=>{navigate('/myoffers');clickMenu()}}>my offers</MenuButton>
          <MenuButton onClick={()=>{navigate('/mylikes');clickMenu()}} >My likes</MenuButton>
         
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
