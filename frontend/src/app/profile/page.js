"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, Mail, User, Trash2, Lock } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteAccount } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleDeleteAccount = async () => {
    if (!password) return;
    await deleteAccount(password);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
              
              {/* DELETE ACCOUNT SECTION */}
              <div className="flex items-center justify-between py-2 border-t border-zinc-700 pt-4 mt-4">
                 {!showDeleteConfirm ? (
                    <>
                        {/* Left Side: Red Text */}
                        <span className="text-error font-medium">Delete Account</span>
                        
                        {/* Right Side: Red Button */}
                        <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="btn btn-sm btn-error text-white"
                        >
                            <Trash2 className="size-4" /> Delete Account
                        </button>
                    </>
                 ) : (
                    /* Password Confirmation View */
                    <div className="w-full animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center gap-2 justify-end">
                            <div className="relative w-full max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-4 text-base-content/40" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password to confirm"
                                    className="input input-sm input-bordered w-full pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button 
                                onClick={handleDeleteAccount}
                                className="btn btn-sm btn-error text-white"
                                disabled={!password || isUpdatingProfile}
                            >
                                {isUpdatingProfile ? "..." : "Confirm"}
                            </button>
                            <button 
                                onClick={() => {setShowDeleteConfirm(false); setPassword("");}}
                                className="btn btn-sm btn-ghost"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                 )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProfilePage;