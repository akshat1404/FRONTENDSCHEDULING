import React, { useRef, useState } from 'react';
import Input from '../Utils/Input';
import './auth.css'; 
import {post} from '../Axios/Axios';
import store from 'store';

function Auth() {

    const NAME = useRef();
    const EMAIL = useRef();
    const PASSWORD = useRef();
    const [sign, setSign] = useState(false);

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      }      

    return (
        <div className="auth-container">
            <h1
                style={{
                    position: 'absolute',
                    left:'50px',
                    top:'60px',
                    fontSize: '80px'
                }}
            >Schedule Management</h1>
            <div 
                style={{backgroundColor: 'white', zIndex:1, padding:'20px 40px', borderRadius:'15px', position:'absolute', bottom:'180px', right:'150px'}} 
            >
                {!sign ?
                <>
                    <h2 style={{color:'black', margin:'20px 0'}} >Login to your account</h2>
                    <Input style={{justifyContent:'end'}} labelStyle={{fontSize:'16px'}} ref={EMAIL} label="Email" />
                    <Input style={{justifyContent:'end'}} labelStyle={{fontSize:'16px'}} ref={PASSWORD} label="Password" />
                    <button
                        style={{marginTop:'20px'}}
                        onClick={() => {
                            let email=EMAIL.current.getValue();
                            let password=PASSWORD.current.getValue();
                            post('auth/login',{
                                email,
                                password
                            },(response) => {
                                if(response?.token){
                                    const expiresAt = Date.now() + 3600 * 1000;
                                    store.set('token', {token : response.token, expiresAt});
                                    alert("Successfully Logged In");
                                    window.location.reload("/");
                                }
                            })
                        }}
                    >
                        Login
                    </button>
                    <p  style={{color:'black'}} >Don't have an account, <button onClick={() => setSign(true)} style={{border:'none',backgroundColor:'white',color:'blue',display:'inline', margin:'5px', fontWeight:'bold'}} >sign up</button>now</p>
                </>
                :
                
                <>
                    <h2 style={{color:'black', margin:'20px 0'}} >Create Account</h2>
                    <Input style={{justifyContent:'end'}} labelStyle={{fontSize:'16px'}} ref={EMAIL} label="Email" />
                    <Input style={{justifyContent:'end'}} labelStyle={{fontSize:'16px'}} ref={PASSWORD} label="Password" />
                    <Input style={{justifyContent:'end'}} labelStyle={{fontSize:'16px'}} ref={NAME} label="Name" />
                    <button
                        style={{marginTop:'20px'}}
                        onClick={() => {
                            let name = NAME.current.getValue();
                            let email = EMAIL.current.getValue();
                            let password = PASSWORD.current.getValue();
                            
                            if(!name || !email || !password || !validateEmail(email)) return ;

                            post('auth/signup',{
                                name:name,
                                email:email,
                                password:password
                            },(res)=>{
                                setSign(false);
                                alert("Successfully Signed In");
                                console.log(res);
                            })
                        }}
                    >
                        Sign Up
                    </button>
                    <p  style={{color:'black'}} >Already have an account, <button onClick={() => setSign(false)} style={{border:'none',backgroundColor:'white',color:'blue',display:'inline', margin:'5px', fontWeight:'bold'}} >Login</button>now</p>
                </>
                }
            </div>
        </div>
    );
}

export default Auth;
