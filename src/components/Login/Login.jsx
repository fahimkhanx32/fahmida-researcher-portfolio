import { useState } from "react";
import loginbg1 from "../../assets/loginbg1.png"

import { FaSignInAlt, FaEnvelope, FaUserCheck,FaKey, FaEye, FaEyeSlash} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuNotebookPen } from "react-icons/lu";
import { MdKey } from "react-icons/md";
import { Link } from 'react-router-dom';


const Login = () => {

    const [show, setShow] = useState(false)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleEmail = (e) =>{
    setEmail(e.target.value);
    setEmailError("")
  };



  const handlePassword = (e) =>{
    setPassword(e.target.value);
    setPasswordError("")
  };
  
  const handleLogin = () =>{
    
   console.log(email);

   if(!email){
    setEmailError("provide an email");
   } else {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      setEmailError ("Enter valid email");
    }
   }

  

   if (!password){
    setPasswordError("provide password");
   } else {
    if (!/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/.test (password)){
      setPasswordError("wrong password ");
    }
   }

   
  };

  return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
                  style={{ backgroundImage: `url(${loginbg1})`, backgroundColor: "#e6e6e6", }} >


         <div className="w-full max-w-sm mt-18">
                              {/* ⭐ Neumorphic Form Box */}
                    <div className="bg-[#bfbfbf] rounded-2xl overflow-hidden border border-black shadow-[8px_8px_16px_#a1a1a1,-8px_-8px_16px_#dcdcdc]">

                        {/* Top bar */}      


            {/* Form area */}
            <div className="px-4 py-5">

              {/* Email */}
              <div className="relative mb-6">
                <input id="email" onChange={handleEmail} value={email} type="email" placeholder={emailError || "Enter your email here"} className={`peer w-full px-4 pr-10 pt-2 pb-2 text-black bg-transparent border ${emailError ? "border-red-500" : "border-gray-500"} rounded-md outline-none focus:border-white placeholder-transparent tracking-wide`} />
                {emailError && (<span className="absolute text-white rounded text-xs top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 px-1"> {emailError}</span>)}
                <label htmlFor="email" className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-black peer-focus:-translate-y-1/2 peer-focus:bg-[#bfbfbf] peer-focus:px-1 tracking-wider peer-not-placeholder-shown:bg-[#bfbfbf] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:-translate-y-1/2">Email
                </label> <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base" />
              </div>

              {/* password */}
              <div className="relative mb-6">
                <input id="password" onChange={handlePassword} type={show ? "text" : "password"} required placeholder={passwordError || "Enter your Password here"} className={`peer w-full px-10 pr-10 pt-2 pb-2 text-black bg-transparent border ${passwordError ? "border-red-500" : "border-gray-500"} rounded-md outline-none focus:border-white placeholder-transparent tracking-wide`} />
                {passwordError && (<span className="absolute text-white rounded text-xs top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 px-1"> {passwordError}</span>)}
                <label htmlFor="password" className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-black peer-focus:-translate-y-1/2 peer-focus:bg-[#bfbfbf] peer-focus:px-1 tracking-wider peer-not-placeholder-shown:bg-[#bfbfbf] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:-translate-y-1/2">Password </label> 
                <MdKey className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-2xl opacity-0  transition-all duration-200 peer-focus:opacity-100 peer-not-placeholder-shown:opacity-100" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base">
                  {show ? (<FaEyeSlash onClick={() => setShow(!show)} />) :
                    (<FaEye onClick={() => setShow(!show)} />)}
                </div>
              </div>



              <div className="flex items-center justify-between mb-4">
                {/* Remember me Checkbox */}
                <button className="flex items-center justify-center gap-2 text-sm px-2 py-1 rounded-md transition-all tracking-wider bg-transparent hover:bg-[#a6a6a6] border border-black cursor-pointer" title="Agree to T&C" > <input type="checkbox" aria-label="Agree to T&C" className="form-checkbox" /> <span className="text-black whitespace-nowrap">Remember me</span> <FaUserCheck /> </button>


                {/* Forgot password Button */}
                <button className="flex items-center justify-center gap-2 text-black text-sm px-2 py-1 rounded-md transition-all tracking-wider bg-transparent hover:bg-[#a6a6a6] border border-black cursor-pointer"> Forgot password ? <FaKey />
                </button>
              </div>


              {/* Sign Up Button */}
                <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 text-black font-medium px-2 py-1 rounded-md transition-all tracking-wider bg-transparent hover:bg-[#a6a6a6] border border-black cursor-pointer shadow-[8px_8px_16px_#a1a1a1,-8px_-8px_16px_#dcdcdc] active:shadow-[inset_6px_6px_12px_#a1a1a1,inset_-6px_-6px_12px_#dcdcdc]"> Log in <FaSignInAlt />
                </button>





            </div>

            {/* Bottom buttons */}
            <Link to="/registration" className="w-full"><button aria-label="Registration" className="w-full flex items-center justify-center gap-2 bg-[#bfbfbf] text-black text-md py-3 px-4 border-t-4 border-[#8c8c8c] hover:bg-[#a6a6a6] hover:shadow-lg hover:border-[#8c8c8c] transition-all duration-200 rounded-lg">
              <span className="text-base transition-colors group-hover:text-black">No account ? Sign up </span>
              <span className="text-black text-lg transition"> <LuNotebookPen /> </span>
            </button>  </Link>
            




          </div>
        </div>

               


            </div>

        </>
    )
}


export default Login