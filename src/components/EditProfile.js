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
    const [userDetails, setuserDetails] = useState(0);
    const [editDetails, seteditDetails] = useState({
        fname:"",
        lname:"",
        password:""
    });
    const [showPopup, setshowPopup] = useState(false);
    const [errPassword, seterrPassword] = useState(false);
    const [disableEditBtn, setdisableEditBtn] = useState(true);



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
        console.log(e.target.name)
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
                console.log(data)
                if (data.status === "success") {
                    cookies.set("emailAccount",{fname: editDetails.fname, lname: editDetails.lname, email: userEmail, password: userPassword},{ path: '/' })
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
                    <h1>Email: {userDetails.email}</h1>
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
                        Edit
                    </CustomButton>

                </div>
            </Fade>:
            <PopUpMessage 
                    title="Edit your profile" 
                    explain={"Are you sure you want to edit yur profile, your name: "+editDetails.fname+" "+editDetails.lname}
                    btnName="Cancel"
                    secondBtnName="Edit Profile"
                    navigate={0}
                    function={editProfile}
                    />}
    </div>
    
    
  )
}
