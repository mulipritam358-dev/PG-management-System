import Signup from "../Signup";
import Context from "./SignupContext";
import { useState } from "react";
import { loginValidation } from "../AuthHelper";
const SignupState = ({ children }) => {
  const [signupCred, setSignupCred] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [messageType, setMessageType] = useState("");
  const [close, setClose] = useState(true);
  const [signupMessage, setsignupMessage] = useState("");

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    confirmPassword: "",
    mobileNumber: "",
    role: "",
  });

    const { email, password, confirmPassword, mobileNumber, role } = signupCred;

  const passwordRules = [
    {
      label: "At least 8 characters",
      test: (password) => password.length >= 8,
    },
    {
      label: "At least one uppercase letter (A–Z)",
      test: (password) => /[A-Z]/.test(password),
    },
    {
      label: "At least one lowercase letter (a–z)",
      test: (password) => /[a-z]/.test(password),
    },
    {
      label: "At least one number (0–9)",
      test: (password) => /\d/.test(password),
    },
    {
      label: "At least one special character (@$!%*?&)",
      test: (password) => /[@$!%*?&]/.test(password),
    },
  ];

  const validatePassword = (password) =>
    passwordRules.every((rule) => rule.test(password));

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignupCred((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      setFieldErrors((prev) => ({
        ...prev,
        email:
          value.trim() === ""
            ? "Email is required."
            : !emailRegex.test(value.trim())
              ? "Please enter a valid email address."
              : "",
      }));
    }

    if (name === "password" || name === "confirmPassword") {
      const updatedPassword = name === "password" ? value : password;

      const updatedConfirmPassword =
        name === "confirmPassword" ? value : confirmPassword;

      setFieldErrors((prev) => ({
        ...prev,
        password: validatePassword(updatedPassword)
          ? ""
          : prev.password && updatedPassword
            ? "Password does not meet all requirements."
            : "",
        confirmPassword:
          updatedConfirmPassword === ""
            ? ""
            : updatedPassword !== updatedConfirmPassword
              ? "Passwords do not match."
              : "",
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setsignupMessage("");

    // Validate email before submitting
    if (!validateEmail(email.trim())) {
      setFieldErrors((prev) => ({
        ...prev,
        email:
          email.trim() === ""
            ? "Email is required."
            : "Please enter a valid email address.",
      }));
      return;
    }

    // Validate password match before submitting
    if (password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    if (!validatePassword(password)) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Password does not meet all requirements.",
      }));
      return;
    }
    // Clear field errors before API call
    setFieldErrors({
      email: "",
      confirmPassword: "",
    });

    const result = await loginValidation(
      email.trim(),
      mobileNumber,
      password,
      confirmPassword,
      role,
    );

    setClose(true);

    if (result?.status !== 201) {
      setMessageType("error");
      setsignupMessage(result?.error || "Signup failed. Please try again.");

      setTimeout(() => {
        setMessageType("");
        setsignupMessage("");
      }, 5000);
    } else {
      setMessageType("success");
      setsignupMessage(result?.data?.message);
      setSignupCred({
        email: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        role: "",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const dummy = () => {
    console.log("I am dummy")
  }
  return (
    <Context.Provider
      value={{
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
        handleSignup, 
        handleChange, 
        validatePassword, 
        passwordRules,
        dummy
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default SignupState;
