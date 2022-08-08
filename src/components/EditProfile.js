import { Box, Button, Fade, styled, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { DisappearedLoading } from 'react-loadingg';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "../styles/editProfile.css"
import PopUpMessage from './PopUpMessage';


const CustomButton = styled(Button)(({ theme }) => ({
    margin: "2%",
    backgroundColor:"#86a3b4", 
    color:"#4a4a4a", 
    fontWeight:"bold", 
    border:"0.5px solid #46576d",

    borderRadius:"8px",
    ":hover":{
        backgroundColor:"#46576d",
        color: "#b1b1b1"
        }
  }));
export default function EditProfile() {
    const [userEmail, setuserEmail] = useState(0);
    const [userPassword, setuserPassword] = useState();
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const cookies = new Cookies();
    const [showPopUp, setshowPopUp] = useState(false);
    const [userDetails, setuserDetails] = useState(0);
    const [editDetails, seteditDetails] = useState({
        fname:"",
        lname:"",
        password:""
    });
    const [showPopup, setshowPopup] = useState(false);
    const [errPassword, seterrPassword] = useState(false);
    const [disableEditBtn, setdisableEditBtn] = useState(true);
    const [popupDetails, setpopupDetails] = useState();


    useEffect(() => {
        if(cookies.get("emailAccount")===undefined){
            navigate('/signin',{replace: true, state: {comeFromSite: true, path: location.pathname}})
        }
        else{
            setuserEmail(cookies.get("emailAccount").email)
            setuserPassword(cookies.get("emailAccount").password)
            fetch(("https://onlineauctionapi.herokuapp.com/getprofile"),{
            method: "post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: userEmail, password: userPassword})
            })
            .then(res=>res.json())
            .then(data=>{
                // console.log(data)
                if (data.status === "success") {
                    setuserDetails(data.message)
                    seteditDetails(prev=>({
                        ...prev,
                        fname:data.message.fname,
                        lname:data.message.lname
                    }))
                } else {
                    
                }
            })  
        }
        
    }, [userEmail]);

    const handleChange=(e)=>{
        switch (e.target.name) {
            
            case "fname":
                seteditDetails(prev=>({
                    ...prev,
                    fname: e.target.value,
                }))
                break;
            case "lname":
                seteditDetails(prev=>({
                    ...prev,
                    lname: e.target.value,
                }))
                break;
            case "password":
                seteditDetails(prev=>({
                    ...prev,
                    password: e.target.value,
                }))
                break;
            default:
                break;
        }
        
    }

    useEffect(() => {
        // console.log(editDetails)
        if (editDetails.fname!==""&&editDetails.lname!==""&&editDetails.password!=="") {
            setdisableEditBtn(false)
        }
        else{
            setdisableEditBtn(true)
        }
    }, [editDetails]);

    const editBtn =()=>{
        setpopupDetails({
            title:"Edit your profile" ,
            explain:"Are you sure you want to edit your profile, Your name: "+editDetails.fname+" "+editDetails.lname,
            btnName:"Cancel",
            secondBtnName:"Edit Profile",
            navigate:0,
            function: (editProfile),
          })
          if (editDetails.password===userDetails.password) {
            setshowPopup(true)
        } else {
            seterrPassword(true)
        }
    }
    
    

    const editProfile = () =>{
        fetch(("https://onlineauctionapi.herokuapp.com/updateprofile"),{
            method: "post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: userEmail, password: userPassword, newname:editDetails.fname,newlast:editDetails.lname, newpass:editDetails.password})
            })
            .then(res=>res.json())
            .then(data=>{
                if (data.status === "success") {
                    cookies.set("emailAccount",{fname: editDetails.fname, lname: editDetails.lname, email: userEmail, password: userPassword},{ path: '/' })
                    window.location.reload()
                } else {
                    
                }
            })  
    }

    const delBtn =()=>{
        setpopupDetails({
            title:"Delete Account" ,
            explain: "Are you sure you want to DELETE your account, This action can't be restored, All your sales will also be deleted and your liked list will be removed.",
            btnName:"Cancel",
            secondBtnName:"Delete Account",
            navigate:0,
            function: (deleteProfile),
          })
          if (editDetails.password===userDetails.password) {
            setshowPopup(true)
        } else {
            seterrPassword(true)
        }
    }
    const deleteProfile =()=>{
        fetch(("https://onlineauctionapi.herokuapp.com/delete"),{
            method: "post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: userEmail, password: editDetails.password})
            })
            .then(res=>res.json())
            .then(data=>{
                if (data.status === "success") {
                    cookies.remove("emailAccount", { path: '/' })
                    window.location.reload()
                } else {
                    
                }
            })  
    }

  return (
    <div>
        {userDetails===0?<DisappearedLoading style={{margin:"11vh auto"}} color='#5a7e90'/>:null}

        {!showPopup?<Fade in={userDetails!==0}>
                <div className='editProfile'>
                    <h1>Account: {userDetails.email}</h1>
                    <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off">
                        <TextField value={editDetails.fname} name='fname' onChange={handleChange} id="outlined-basic" label="First Name" variant="outlined" />
                        <TextField value={editDetails.lname} name='lname' onChange={handleChange} id="outlined-basic" label="Last Name" variant="outlined" />
                    </Box>
                    {errPassword?<h3>The password is not correct.</h3>:null}
                    <TextField autoComplete='off' error={errPassword} value={editDetails.password} type="password" name='password' onChange={handleChange} id="outlined-basic" label="Password" variant="outlined" />
                    <br></br>
                    
                    <CustomButton onClick={editBtn} disabled={disableEditBtn}>
                        Edit Profile
                    </CustomButton>
                    <br/>
                    <CustomButton onClick={delBtn} disabled={disableEditBtn}>
                        Delete Account
                    </CustomButton>

                </div>
            </Fade>:
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
