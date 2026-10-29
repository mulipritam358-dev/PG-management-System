import React, { useContext, useEffect, useState } from "react";
import logo from "../images/logo.png";
import { loginValidation } from "./AuthHelper";
import ErrorBanner from "../CommonComponent/ErrorBanner";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Context from "./context/SignupContext";

function Signup() {
  const {
    close,
    setClose,
    signupMessage,
    setsignupMessage,
    fieldErrors,
    setFieldErrors,
    showConfirmPassword,
    setShowConfirmPassword,
    messageType,
    setMessageType,
    showPassword,
    setShowPassword,
    signupCred,
    setSignupCred,
    passwordRules,
    handleSignup,
    handleChange,
    validatePassword,
  } = useContext(Context);
  return (
    <div className="container signup-container">
      <div className="row signup-row justify-content-center align-items-center g-4">
        {/* Image Section */}
        <div className="col-lg-6 image-column">
          <img src={logo} className="logo-image" alt="Signup illustration" />
        </div>

        {/* Form Section */}
        <div className="col-lg-6">
          <div className="form-heading-style">
            {signupMessage && close ? (
              <ErrorBanner
                message={signupMessage}
                type={messageType}
                setClose={setClose}
              />
            ) : null}

            <h2>Sign Up</h2>
            <p className="text-muted mb-4">
              Sign in using existing details/sign up here
            </p>

            <form id="form" onSubmit={handleSignup}>
              {/* Email */}
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control ${
                    fieldErrors.email ? "is-invalid" : ""
                  }`}
                  name="email"
                  id="email"
                  value={signupCred.email}
                  onChange={handleChange}
                  placeholder="Enter Your email"
                  autoComplete="email"
                />

                {fieldErrors.email && (
                  <div className="text-danger mt-1 text-start w-100">
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <input
                  type="tel"
                  className="form-control"
                  name="mobileNumber"
                  id="mobileNumber"
                  value={signupCred.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter Your contact number"
                  autoComplete="tel"
                />
              </div>

              <div class="form-field mb-3">
                <select
                  class="form-control"
                  id="role"
                  name="role"
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="user" selected>
                    User
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      fieldErrors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    name="password"
                    value={signupCred.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </button>
                </div>
                {signupCred.password.length > 0 &&
                  !validatePassword(signupCred.password) && (
                    <div className="mt-2 text-start w-100">
                      <small className="text-muted">
                        Your password must meet these requirements:
                      </small>

                      <ul className="list-unstyled mt-2 mb-0 text-start">
                        {passwordRules.map((rule, index) => {
                          const passed = rule.test(signupCred.password);

                          return (
                            <li
                              key={index}
                              className={`small text-start ${
                                passed ? "text-success" : "text-danger"
                              }`}
                            >
                              {passed ? "✓" : "✗"} {rule.label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                {fieldErrors.password &&
                  !validatePassword(signupCred.password) && (
                    <div className="text-danger mt-1 text-start w-100">
                      {fieldErrors.password}
                    </div>
                  )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control ${
                      fieldErrors.confirmPassword ? "is-invalid" : ""
                    }`}
                    name="confirmPassword"
                    value={signupCred.confirmPassword}
                    onChange={handleChange}
                    id="confirm-password"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </button>
                </div>

                {fieldErrors.confirmPassword && (
                  <div className="text-danger mt-1 text-start w-100">
                    {fieldErrors.confirmPassword}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary signup-btn w-100 py-2"
              >
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
