import axios from "axios";
const loginValidation = async (
  email,
  mobileNumber,
  password,
  confirmPassword,
  role
) => {
  try {
    const resp = await axios.post("http://localhost:8081/api/users", {
      email: email,
      password: password,
      mobileNumber: mobileNumber,
      role: role
    });

    return resp;
  } catch (error) {
    console.log(error)
       if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
    } else {
      console.log("Request error:", error.message);
    }
  }
  // }
};

export { loginValidation };
