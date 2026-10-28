import React, { useState } from "react";
import logo from "../images/logo.png";
import { loginValidation } from "./AuthHelper";
import ErrorBanner from "../CommonComponent/ErrorBanner";

function Signup() {
  const [signupCred, setSignupCred] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });

  const [messageType, setMessageType] = useState("");
  const [close, setClose] = useState(true)

  const [signupMessage, setsignupMessage] = useState("");
  const { email, password, confirmPassword, mobileNumber } = signupCred;

  const handleSignup = async () => {
    setsignupMessage(""); // Clear previous error

    const result = await loginValidation(
      email,
      mobileNumber,
      password,
      confirmPassword,
    );

    setClose(true);

    if (result?.status != 201) {
      setMessageType("error");
      setsignupMessage(result?.error);

      setTimeout(() => {
        setMessageType("");
        setsignupMessage("");
      }, 5000);
      return;
    } else {
      setMessageType("success");
      setsignupMessage(result?.data?.message);
    }
  };

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
          {signupMessage && close ? (
            <ErrorBanner message={signupMessage} type={messageType} setClose={setClose} />
          ) : null}
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
                name="confirmPassword"
                onChange={handleChange}
                id="confirm-password"
                placeholder="Confirm password"
              />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleSignup();
                // loginValidation(email, mobileNumber, password, confirmPassword);
              }}
              type="submit"
              className="btn btn-primary signup-btn"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;