import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { authinstance } from "../lib/axiosinstance";
import {toast} from "react-toastify"

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone,setPhone]=useState("")
  const navigate=useNavigate()

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await authinstance.post("/register", {
        fullname: name,
        email: email,
        password: password,
        phone:phone
      });

      console.log("Success:", response.data);
      toast.success(response.data.message)
      
      navigate("/login")

      // Clear the form only after successful registration
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setPhone("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed")
      console.log(error);
      

    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 font-sans selection:bg-[#3b82f6] selection:text-white">
      ```
      <form
        onSubmit={registerUser}
        className="w-full max-w-md bg-[#171717] border-4 border-white p-8 md:p-10 shadow-[8px_8px_0px_0px_#3b82f6] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#3b82f6]"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white uppercase">
            Join Us
          </h1>

          <p className="text-zinc-400 font-medium">
            Create your account to get started.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border-2 border-zinc-600 px-4 py-3 font-semibold text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[4px_4px_0px_0px_#3b82f6] focus:-translate-y-0.5 focus:-translate-x-0.5"
            />
          </div>

          <div> 
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border-2 border-zinc-600 px-4 py-3 font-semibold text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[4px_4px_0px_0px_#3b82f6] focus:-translate-y-0.5 focus:-translate-x-0.5"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border-2 border-zinc-600 px-4 py-3 font-semibold text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[4px_4px_0px_0px_#3b82f6] focus:-translate-y-0.5 focus:-translate-x-0.5"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border-2 border-zinc-600 px-4 py-3 font-semibold text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[4px_4px_0px_0px_#3b82f6] focus:-translate-y-0.5 focus:-translate-x-0.5"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Enter your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border-2 border-zinc-600 px-4 py-3 font-semibold text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[4px_4px_0px_0px_#3b82f6] focus:-translate-y-0.5 focus:-translate-x-0.5"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-10 w-full bg-[#3b82f6] text-white border-4 border-white py-4 font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_0px_#ffffff] transition-all duration-150 hover:shadow-[8px_8px_0px_0px_#ffffff] hover:-translate-y-1 active:shadow-[0px_0px_0px_0px_#ffffff] active:translate-y-2 active:translate-x-2"
        >
          Register
        </button>

        <p className="text-zinc-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#3b82f6] font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
