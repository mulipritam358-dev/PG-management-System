import axios from "axios";
const loginValidation = async (email, mobileNumber, password, confirmPassword, setSignuperror) => {
  const resp = await axios.post("http://localhost:8081/api/users", {
     email: email,
    password: password,
    mobileNumber: mobileNumber
  });
};

export { loginValidation };
