import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const MAX_PROFILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_AADHAR_SIZE = 5 * 1024 * 1024; // 5 MB

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "tenant",
    mobileNumber: "",
    profileImage: null,
    aadharCard: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateFile = (file, type, maxSize) => {
    if (!file) return `${type} is required`;

    if (type === "profileImage" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Profile image must be JPG, JPEG, PNG, or WEBP";
    }

    if (type === "aadharCard" && file.type !== "application/pdf") {
      return "Aadhar card must be a PDF file";
    }

    if (file.size > maxSize) {
      return `${type} size should be less than ${maxSize / 1024 / 1024} MB`;
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!mobileRegex.test(formData.mobileNumber)) {
      setError("Mobile number must contain exactly 10 digits");
      return;
    }

    const profileError = validateFile(
      formData.profileImage,
      "profileImage",
      MAX_PROFILE_SIZE,
    );
    if (profileError) {
      setError(profileError);
      return;
    }

    const aadharError = validateFile(
      formData.aadharCard,
      "aadharCard",
      MAX_AADHAR_SIZE,
    );
    if (aadharError) {
      setError(aadharError);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("email", formData.email);
    uploadData.append("password", formData.password);
    uploadData.append("role", formData.role);
    uploadData.append("mobileNumber", formData.mobileNumber);
    uploadData.append("profileImage", formData.profileImage);
    uploadData.append("aadharCard", formData.aadharCard);

    try {
      const response = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        body: uploadData,
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Upload failed");
      }

      setSuccess("User created successfully");
      setFormData({
        email: "",
        password: "",
        role: "tenant",
        mobileNumber: "",
        profileImage: null,
        aadharCard: null,
      });
      e.target.reset();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="card">
        <h2>Upload User Document</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
            <option value="user">User</option>
          </select>

          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            name="aadharCard"
            accept="application/pdf"
            onChange={handleChange}
            required
          />

          <button type="submit">Upload</button>
        </form>
      </div>
      <ToastContainer />{" "}
    </>
  );
}

export default Signup;
// import React from "react";

// function Signup() {
//   return (
//     <div class="card">
//       <h2>Upload User Document</h2>
//       <form action="/api/users" method="post" enctype="multipart/form-data">
//         <input type="email" name="email" placeholder="Email" required />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           required
//         />
//         <select name="role">
//           <option value="admin">Admin</option>
//           <option value="owner">Owner</option>
//           <option value="tenant" selected>
//             Tenant
//           </option>
//           <option value="user">User</option>
//         </select>
//         <input type="text" name="mobileNumber" placeholder="Mobile Number" />
//         <input type="file" name="profileImage" accept="*" required />

//         <input
//           type="file"
//           name="aadharCard"
//           accept="application/pdf"
//           required
//         />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// }

// export default Signup;
