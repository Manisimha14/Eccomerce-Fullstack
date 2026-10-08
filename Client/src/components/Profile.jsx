import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authinstance } from "../lib/axiosinstance";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileData = async () => {
    try {
      const response = await authinstance.get("/me");

      console.log(response.data);

      const data = response.data;

      setUser({
        fullname: data.Customer.fullname,
        email: data.Customer.email,
        phone: data.Customer.phone,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    profileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
        <h1 className="text-2xl font-black uppercase">Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Navbar */}
      <nav className="w-full border-b-4 border-white bg-[#171717]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black uppercase tracking-tight">
            My<span className="text-[#3b82f6]">App</span>
          </Link>

          <div className="flex gap-3">
            <Link
              to="/"
              className="border-2 border-white px-4 py-2 font-bold uppercase text-sm hover:bg-white hover:text-black transition-all"
            >
              Home
            </Link>

            <Link
              to="/profile"
              className="border-2 border-[#3b82f6] text-[#3b82f6] px-4 py-2 font-bold uppercase text-sm hover:bg-[#3b82f6] hover:text-white transition-all"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile Section */}
      <main className="min-h-[calc(100vh-88px)] flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Heading */}
          <div className="mb-8">
            <p className="text-[#3b82f6] font-black uppercase tracking-widest mb-3">
              Account
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight">
              Your Profile
            </h1>

            <p className="text-zinc-400 mt-3">
              Manage and view your account information.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-[#171717] border-4 border-white p-8 md:p-10 shadow-[10px_10px_0px_0px_#3b82f6]">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-2 border-zinc-700 pb-8 mb-8">
              <div className="w-24 h-24 bg-[#3b82f6] border-4 border-white flex items-center justify-center text-4xl font-black shadow-[5px_5px_0px_0px_#ffffff]">
                {user?.fullname?.charAt(0).toUpperCase()}
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black uppercase">
                  {user?.fullname}
                </h2>

                <p className="text-zinc-400 mt-2">Member</p>
              </div>
            </div>

            {/* User Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="bg-[#0a0a0a] border-2 border-zinc-600 p-5 hover:border-[#3b82f6] transition-all">
                <p className="text-zinc-500 text-sm font-bold uppercase mb-2">
                  Full Name
                </p>

                <p className="text-xl font-bold">{user?.fullname}</p>
              </div>

              {/* Email */}
              <div className="bg-[#0a0a0a] border-2 border-zinc-600 p-5 hover:border-[#3b82f6] transition-all">
                <p className="text-zinc-500 text-sm font-bold uppercase mb-2">
                  Email
                </p>

                <p className="text-xl font-bold break-all">{user?.email}</p>
              </div>

              {/* Phone */}
              <div className="bg-[#0a0a0a] border-2 border-zinc-600 p-5 hover:border-[#3b82f6] transition-all">
                <p className="text-zinc-500 text-sm font-bold uppercase mb-2">
                  Phone
                </p>

                <p className="text-xl font-bold">{user?.phone}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-5 mt-10">
              <button className="flex-1 bg-[#3b82f6] text-white border-4 border-white py-4 font-black uppercase tracking-wider shadow-[6px_6px_0px_0px_#ffffff] transition-all hover:shadow-[8px_8px_0px_0px_#ffffff] hover:-translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2">
                Edit Profile
              </button>

              <Link
                to="/"
                className="flex-1 text-center bg-[#171717] border-4 border-[#3b82f6] py-4 font-black uppercase tracking-wider shadow-[6px_6px_0px_0px_#3b82f6] transition-all hover:shadow-[8px_8px_0px_0px_#3b82f6] hover:-translate-y-1 active:shadow-none active:translate-x-2 active:translate-y-2"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
