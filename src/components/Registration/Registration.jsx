import { useState } from "react";
import signupbg1 from "../../assets/signupbg1.png";

import {
FaUserAlt,
FaEnvelope,
FaUserPlus,
FaEye,
FaEyeSlash,
} from "react-icons/fa";

import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";
import { MdKey } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CircularProgress } from "react-loader-spinner";

const Registration = () => {
const navigate = useNavigate();

const [show, setShow] = useState(false);

const [email, setEmail] = useState("");
const [UserName, setUserName] = useState("");
const [password, setPassword] = useState("");

const [emailError, setEmailError] = useState("");
const [userNameError, setUserNameError] = useState("");
const [passwordError, setPasswordError] = useState("");

const [loading, setLoading] = useState(false);

const handleEmail = (e) => {
setEmail(e.target.value);
setEmailError("");
};

const handleUserName = (e) => {
setUserName(e.target.value);
setUserNameError("");
};

const handlePassword = (e) => {
setPassword(e.target.value);
setPasswordError("");
};

const handleSignUp = () => {
setLoading(true);

let hasError = false;

// Email validation
if (!email) {
  setEmailError("Provide an email");
  hasError = true;
} else if (
  !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
) {
  setEmailError("Give a valid email");
  hasError = true;
}

// Username validation
if (!UserName) {
  setUserNameError("Provide a username");
  hasError = true;
}

// Password validation
if (!password) {
  setPasswordError("Provide a password");
  hasError = true;
} else if (password.length < 6) {
  setPasswordError("Password must be at least 6 characters");
  hasError = true;
} else if (
  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/.test(
    password
  )
) {
  setPasswordError(
    "Password needs uppercase, lowercase, number and symbol"
  );
  hasError = true;
}

if (hasError) {
  setLoading(false);
  return;
}

// Registration completed
console.log("Registration:", {
  username: UserName,
  email: email,
});

toast.success("Registration completed successfully!");

setTimeout(() => {
  setLoading(false);
  navigate("/login");
}, 1000);


};

return (
<>
<div className="min-h-screen flex items-center justify-center bg-cover bg-center p-6" style={{ backgroundImage: `url(${signupbg1})`, backgroundColor: "#e6e6e6", }} >
<ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

    <div className="w-full max-w-sm mt-10">
      <div className="bg-[#bfbfbf] rounded-2xl overflow-hidden border border-black shadow-[8px_8px_16px_#a1a1a1,-8px_-8px_16px_#dcdcdc]">

        {/* Google Button */}
        

        {/* Form */}
        <div className="px-4 py-5">

          {/* Username */}
          <div className="relative mb-6">
            <input
              id="username"
              onChange={handleUserName}
              value={UserName}
              type="text"
              placeholder={
                userNameError || "Enter your username here"
              }
              className={`peer w-full px-4 pr-10 pt-2 pb-2 text-black bg-transparent border ${
                userNameError
                  ? "border-red-500"
                  : "border-gray-500"
              } rounded-md outline-none focus:border-white placeholder-transparent tracking-wide`}
            />

            {userNameError && (
              <span className="absolute text-white rounded text-xs top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 px-1">
                {userNameError}
              </span>
            )}

            <label
              htmlFor="username"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:bg-[#bfbfbf] peer-focus:px-1 peer-not-placeholder-shown:bg-[#bfbfbf] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-sm"
            >
              Username
            </label>

            <FaUserAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base" />
          </div>

          {/* Email */}
          <div className="relative mb-6">
            <input
              id="email"
              onChange={handleEmail}
              value={email}
              type="email"
              placeholder={emailError || "Enter your email here"}
              className={`peer w-full px-4 pr-10 pt-2 pb-2 text-black bg-transparent border ${
                emailError
                  ? "border-red-500"
                  : "border-gray-500"
              } rounded-md outline-none focus:border-white placeholder-transparent tracking-wide`}
            />

            {emailError && (
              <span className="absolute text-white rounded text-xs top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 px-1">
                {emailError}
              </span>
            )}

            <label
              htmlFor="email"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:bg-[#bfbfbf] peer-focus:px-1 peer-not-placeholder-shown:bg-[#bfbfbf] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-sm"
            >
              Email
            </label>

            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base" />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <input
              id="password"
              onChange={handlePassword}
              value={password}
              type={show ? "text" : "password"}
              placeholder={
                passwordError || "Enter your password here"
              }
              className={`peer w-full px-10 pr-10 pt-2 pb-2 text-black bg-transparent border ${
                passwordError
                  ? "border-red-500"
                  : "border-gray-500"
              } rounded-md outline-none focus:border-white placeholder-transparent tracking-wide`}
            />

            {passwordError && (
              <span className="absolute text-white rounded text-xs top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 px-1">
                {passwordError}
              </span>
            )}

            <label
              htmlFor="password"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:bg-[#bfbfbf] peer-focus:px-1 peer-not-placeholder-shown:bg-[#bfbfbf] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-sm"
            >
              Password
            </label>

            <MdKey className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-2xl opacity-0 transition-all duration-200 peer-focus:opacity-100 peer-not-placeholder-shown:opacity-100" />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black text-base"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Terms + Sign Up */}
          <div className="flex items-center justify-between gap-2">

            <label className="flex items-center gap-2 text-black text-sm py-1 px-2 rounded-md border border-black bg-transparent hover:bg-gray-100 transition">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4"
              />

              <span className="text-xs whitespace-nowrap">
                I agree to Terms & Conditions
              </span>
            </label>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="flex items-center justify-center gap-2 text-black font-medium px-2 py-1 rounded-md transition-all tracking-wider bg-transparent hover:bg-[#a6a6a6] border border-black cursor-pointer shadow-[8px_8px_16px_#a1a1a1,-8px_-8px_16px_#dcdcdc] active:shadow-[inset_6px_6px_12px_#a1a1a1,inset_-6px_-6px_12px_#dcdcdc]"
            >
              {loading ? (
                <CircularProgress
                  height="15"
                  width="15"
                  color="#a8c7fa"
                  ariaLabel="circular-progress-loading"
                  visible={true}
                  strokeWidth={2}
                  animationDuration={1}
                />
              ) : (
                "Sign Up"
              )}

              <FaUserPlus />
            </button>
          </div>
        </div>

        {/* Login */}
        <div className="flex items-stretch border-black">
          <Link to="/login" className="w-full">
            <button
              type="button"
              aria-label="Go to login"
              className="w-full flex items-center justify-center gap-2 bg-[#bfbfbf] text-black text-md py-3 px-4 border-t-4 border-[#8c8c8c] hover:bg-[#a6a6a6] hover:shadow-lg transition-all duration-200 rounded-lg"
            >
              <span className="text-base">
                Have an account? Log in
              </span>

              <span className="text-black text-lg">
                <FiLogIn />
              </span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  </div>
</>


);
};

export default Registration;