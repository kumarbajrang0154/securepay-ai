import { useState } from "react";
import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function EditProfilePage() {

  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  const [name, setName] = useState(savedProfile.name || "");
  const [email, setEmail] = useState(savedProfile.email || "");
  const [mobile, setMobile] = useState(savedProfile.mobile || localStorage.getItem("userMobile") || "");
  const [avatar, setAvatar] = useState(savedProfile.avatar || "https://i.pravatar.cc/120");

  const handleSave = () => {

    const profileData = {
      name,
      email,
      mobile,
      avatar
    };

    localStorage.setItem("userProfile", JSON.stringify(profileData));

    alert("Profile Updated Successfully");
  };

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">

          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

          <div className="flex items-center gap-6 mb-8">

            <img
              src={avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full border-2 border-cyan-400"
            />

            <input
              type="text"
              placeholder="Avatar Image URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 w-full"
            />

          </div>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3"
            />

          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
          >
            Save Profile
          </button>

        </div>

      </div>

    </div>
  );
}