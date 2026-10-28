import React, { useState } from "react";
import logo from "../images/logo.png";
import { loginValidation } from "./AuthHelper";

function Signup() {
  const [signupCred, setSignupCred] = useState({
    email: "",
    password: "",
    consfirmPassword: "",
    mobileNumber: ""
  });

  const [signuperror, setSignuperror] = useState({
    emailError: "", 
    passwordError: "",
    consfirmPasswordError: "", 
    mobileNumberError: ""
  })

  const {email, password, consfirmPassword, mobileNumber} = signupCred

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupCred((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container signup-container">
      <div className="row signup-row">
        {/* Image Section */}
        <div className="col-lg-6 image-column">
          <img src={logo} className="logo-image" alt="Signup illustration" />
        </div>

        {/* Form Section */}
        <div className="col-lg-6 form-heading-style">
          <h2>Sign Up</h2>
          <p>Sign in using existing details/sign up here</p>

          <form id="form">
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                onChange={handleChange}
                placeholder="Enter Your email"
                aria-describedby="email"
              />
            </div>

             <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="mobileNumber"
                id="mobileNumber"
                onChange={handleChange}
                placeholder="Enter Your contact number"
                aria-describedby="email"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="consfirmPassword"
                onChange={handleChange}
                id="confirm-password"
                placeholder="Confirm password"
              />
            </div>

            <button onClick={(e) => {e.preventDefault(); loginValidation(email, mobileNumber,  password, consfirmPassword, setSignuperror)}} type="submit" className="btn btn-primary signup-btn">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

// import React from "react";
// import logo from "../images/logo.png"

// function Signup() {
//   return (
//     <>
//     <div className="container">

//     <div className="row">
//       <div className="col-lg-6" >
//         <img src={logo} className="logo-image" alt="Image is loading" />
//       </div>

//       <div className="col-lg-6 form-heading-style">
//         <h2>Sign Up</h2>
//         <p>Sign in using existing details/sign up here</p>

//         <form id="form">
//   <div className="mb-3">
//     <input type="email" className="form-control" id="email" placeholder="Enter Your email" aria-describedby="email" />
//   </div>
//   <div className="mb-3">
//     <input type="password" className="form-control" id="password" placeholder="Enter passowrd" />
//   </div>

//     <div className="mb-3">
//     <input type="password" className="form-control" id="confirm-password" placeholder="Confirm password" />
//   </div>
//       <button type="submit" className="btn btn-primary signup-btn">Signup</button>
// </form>
//       </div>
//     </div>

//     </div>
//     </>

//   );
// }

// export default Signup;
