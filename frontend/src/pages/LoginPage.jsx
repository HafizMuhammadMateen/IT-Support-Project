import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { loginUser } from "../apis/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate(user.role === "admin" ? "/admindashboard" : "/userdashboard");
    }
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await loginUser(formData); // API returns { name, email, role }

  //     if (!response || !response.role) {
  //       throw new Error("Invalid login response");
  //     }

  //     localStorage.setItem("user", JSON.stringify(response));
  //     toast.success("Login successful!");

  //     // Redirect based on role
  //     response.role === "admin" ? navigate("/admindashboard") : navigate("/userdashboard");
  //   } catch (err) {
  //     toast.error("Login failed. Please check your credentials.");
  //   }
  //   setLoading(false);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await loginUser(formData); // API returns { name, email, role }

        if (!response || !response.role) {
            throw new Error("Invalid login response");
        }

        // 🔹 Clear cache before storing new data
        localStorage.clear(); 
        localStorage.setItem("user", JSON.stringify(response));

        toast.success("Login successful!");

        // 🔹 Redirect and force refresh
        const redirectPath = response.role === "admin" ? "/admindashboard" : "/userdashboard";
        navigate(redirectPath);

        setTimeout(() => {
            window.location.reload();
        }, 100); // Delay ensures navigation happens first

    } catch (err) {
        toast.error("Login failed. Please check your credentials.");
    }
    setLoading(false);
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/Logo.jpg" alt="Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          User Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            // label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <InputField
            // label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-primary rounded hover:bg-primaryDark"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
