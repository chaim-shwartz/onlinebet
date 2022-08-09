import react, { useEffect, useState } from "react";
import '../styles/signIn.css'
// import GoogleLogin, { GoogleLogout } from 'react-google-login';
import Cookies from 'universal-cookie';
import {Link, useLocation, useNavigate } from "react-router-dom";
import PopUpMessage from "./PopUpMessage";
// import NavBar from "./NavBar";
import {notify} from 'react-notify-toast';
import { Button, Fade, styled } from "@mui/material";
import { DisappearedLoading } from "react-loadingg";

const CustomButton = styled(Button)(({ theme }) => ({
    // padding:"0.5% 2%",
    margin: "1%",
    border:"0.5px solid #46576d",
    fontSize: 'max(1.7vmin,13px)',
    backgroundColor:"#86a3b4", 
    color:"#4a4a4a", 
    fontWeight:"bold", 
    borderRadius:"8px",
    lineHeight:"100%",
    ":hover":{
      backgroundColor:"#46576d",
      color: "#b1b1b1"
      }
  }));


function SignIn() {        // the login page  
    // const clientId=process.env.REACT_APP_CLIENT_ID; //google client id
    // const [showLoginBtnGoogle, setShowLoginBtnGoogle] = useState(true) //show login button
    const [showLoginBtnEmail,setShowLoginBtnEmail] =useState(false) //toggle between button for login with email to login box
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setpasswordInput] = useState("")
    const [showPopUp, setshowPopUp] = useState(false);
    const [hideLoading, sethideLoading] = useState(true);
    const [enableLoginBtn, setenableLoginBtn] = useState(true);
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const cookies = new Cookies();
    const [popUpContent, setpopUpContent] = useState({              
        registrationSuccess: false,
        popUpTitle: "",
        popUpExplain: "",
    });

    useEffect(() => {  //to check if there is cookies and then to log in for the user and go to the home page
        if(cookies.get("emailAccount")!==undefined){
            sethideLoading(false)

            if(location.state!==null){
                // console.log(location.state)
                if(location.state.comeFromSite){
                    navigate('/', {replace: true})
                    navigate(location.state.path)
                }
            }
            else{
                navigate('/', {replace: true})
            }

        }
    },);
    console.log()

    useEffect(() => {  //function to enable the login btn if the email is good and there is a password
        if (checkEmailValidate(emailInput) && passwordInput!=="") {
            setenableLoginBtn(false)
        }else{
            setenableLoginBtn(true)
        }
    }, [passwordInput, emailInput]);


    // const loginSuccess = (response) => { //when login success get the data and hide the login button)
    //     fetch(("http://localhost:5000/googlelogin"),{
    //         method: "post",
    //         headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    //         body: JSON.stringify({email: response.profileObj.email, name: response.profileObj.givenName, family: response.profileObj.familyName,googleID:response.profileObj.googleId,profileImg:response.profileObj.imageUrl, withGoogle: true})
    //     })
    //     .then(res=>res.json())
    //     .then(data=>{console.log(data)})   


    //     setShowLoginBtnGoogle(false)
    //     cookies.set("googleAccount",{firstName: response.profileObj.givenName, lastName: response.profileObj.familyName, email: response.profileObj.email, profileImg:response.profileObj.imageUrl, googleID:response.profileObj.googleId},{ path: '/' })

    //     navigate('/')
    // }
    // const failureSuccess = (response) => {// if its fail
    //   console.log("failure success"+response);
    // }


    const loginWithEmail=()=>{
        setShowLoginBtnEmail(false)
    }

    const cnacelShowLogin=()=>{
        setShowLoginBtnEmail(true)

    }

    const  loginWithEmailBtn=(event)=>{   //when user click on the login button
        event.preventDefault()
        sethideLoading(false)
        fetch(("https://onlineauctionapi.herokuapp.com/signin"),{
            method: "post",
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email: emailInput, password: passwordInput})
        })
        
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
            if (data.status==="success") {
                cookies.set("emailAccount",{fname: data.fname, lname: data.lname, email: data.email, password: data.password},{ path: '/' })
                notify.show(data.status+": "+data.message, "success", 4000);
            }
            else if(data.status==="error"){
                // setshowPopUp(true)
                // let myColor = { background: '#0E1717', text: "#FFFFFF" };
                notify.show(data.status+": "+data.message, "error", 5000);
                // setpopUpContent({
                //     popUpTitle: data.title,
                //     popUpExplain: data.reason
                // })
            }
            sethideLoading(true)
        })   
        // setEmailInput("")
        setpasswordInput("")
        setenableLoginBtn(false)
        
    }

    const handleChange = (event)=>{
        switch (event.target.name) {
            case "email":
                setEmailInput(event.target.value)
                break;
            case "password":
                setpasswordInput(event.target.value)
                break;
            default:
                break;
        }
    }

    const checkEmailValidate = ( email ) => {// check the email from the user if its valid

        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        if ( re.test(email) ) {
            // this is a valid email address
            return true
        }
        else {
            // invalid email
            return false
        }
    
    }
      
    
      
    return(
        <Fade in><div className="signin">
            {!hideLoading?<DisappearedLoading style={{margin:"-30px auto"}} color='#5a7e90'/>:null}

            {/* <Fade hidden={hideLoading} in={!hideLoading}><h2>loading...</h2></Fade> */}
            {/* <h1>Auction</h1> */}
            {!showPopUp?
            <form hidden={!hideLoading} method="post">
                <div className="loginBox">
                    <h1>Sign In</h1>
                    <hr/>
                    {showLoginBtnEmail?
                    <CustomButton onClick={loginWithEmail}>Login With Email</CustomButton>
                    :
                    <Fade in>
                        <div className="loginWithEmail">
                            <p>Email</p>
                            <input autoFocus type={"email"} placeholder="Your Email:"name="email" value={emailInput} onChange={handleChange}></input>
                            <p>Password</p>
                            <input type={"password"} placeholder="Your Password:" name="password" value={passwordInput} onChange={handleChange}></input>
                            <div className="buttonsCancelLogin">
                                <CustomButton type="submit" disabled={enableLoginBtn} onClick={loginWithEmailBtn}>Login</CustomButton>
                                <CustomButton onClick={cnacelShowLogin}>Cancel</CustomButton>
                            </div>
                        </div>
                    </Fade>
                    }

                    {/* {showLoginBtnGoogle?
                    <GoogleLogin
                        clientId={clientId}
                        buttonText="Login With Google"
                        onSuccess={loginSuccess}
                        onFailure={failureSuccess}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                        
                    />
                    :null} */}

                    {/* {showLogoutBtnGoogle?
                    
                    :null} */}
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link> to do it now!</p>
                </div>
            </form>:
            <PopUpMessage 
            title={popUpContent.popUpTitle} 
            explain={popUpContent.popUpExplain}
            btnName="Try Again"
            refresh={true}
            />
            }
        </div>
        </Fade>
    )

}

export default SignIn;