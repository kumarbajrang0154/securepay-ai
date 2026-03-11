import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function ProfilePage() {

  const mobile = localStorage.getItem("userMobile") || "Not available";

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">

          <div className="flex items-center gap-6">

            <img
              src="https://i.pravatar.cc/120"
              alt="profile"
              className="w-28 h-28 rounded-full border-2 border-cyan-400"
            />

            <div>
              <h2 className="text-2xl font-bold">SecurePay User</h2>
              <p className="text-gray-400">{mobile}</p>
            </div>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Scans</p>
              <p className="text-xl font-semibold text-cyan-400">12</p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Frauds Detected</p>
              <p className="text-xl font-semibold text-red-400">2</p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Security Score</p>
              <p className="text-xl font-semibold text-green-400">98%</p>
            </div>

            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Account Status</p>
              <p className="text-xl font-semibold text-green-400">Active</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}