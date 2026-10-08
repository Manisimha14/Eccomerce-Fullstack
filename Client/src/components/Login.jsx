import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customerContext from "../context/customercontext.js";
import { authinstance } from "../lib/axiosinstance";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate()
  const { refreshCustomer } = useContext(customerContext)


  const loginUser = async (event) => {
    event.preventDefault();
    try {
      const response = await authinstance.post("/login", { email, password });
      await refreshCustomer();
      toast.success(response.data?.message || "Login Successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Some error in Logging In");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#3b82f6] selection:text-white">
        <form
          onSubmit={loginUser}
          className="w-full max-w-md bg-[#171717] border-4 border-white p-8 md:p-10 shadow-[8px_8px_0px_0px_#3b82f6] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#3b82f6]"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white uppercase">
              Welcome Back
            </h1>
            <p className="text-zinc-400 font-medium">
              Log in to your account to continue.
            </p>
          </div>

          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <input
                type="text"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border-2 border-zinc-600 px-4 py-3 font-semibold text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-[#3b82f6] focus:shadow-[4px_4px_0px_0px_#3b82f6] focus:-translate-y-0.5 focus:-translate-x-0.5"
              />
            </div>

            {/* Password Input */}
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-10 w-full bg-[#3b82f6] text-white border-4 border-white py-4 font-black text-lg uppercase tracking-wider shadow-[6px_6px_0px_0px_#ffffff] transition-all duration-150 hover:shadow-[8px_8px_0px_0px_#ffffff] hover:-translate-y-1 active:shadow-[0px_0px_0px_0px_#ffffff] active:translate-y-2 active:translate-x-2"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-sm text-zinc-400">
          New here?{" "}
          <Link to="/register" className="font-bold text-blue-500 hover:underline">
            Create an account
          </Link>
        </p>
      </main>
  );
}

export default Login;
