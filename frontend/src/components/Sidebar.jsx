"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { Users, Bot } from "lucide-react";

// UPDATED: Name and Photo
const AI_USER = {
  _id: "555555555555555555555555",
  email: "ai@gemini.com",
  fullName: "Your AI Friend",
  profilePic: "/aifriend.jpg", // Make sure this image exists in /public
};

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {/* GEMINI AI BUTTON */}
        <button
          onClick={() => setSelectedUser(AI_USER)}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${selectedUser?._id === AI_USER._id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
          <div className="relative mx-auto lg:mx-0">
            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center object-cover">
               {/* Use the image if available, else fallback to icon */}
               <img 
                 src={AI_USER.profilePic} 
                 alt="AI" 
                 className="size-12 rounded-full object-cover"
                 onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} 
               />
               <div className="hidden size-12 rounded-full bg-blue-100 items-center justify-center">
                  <Bot className="size-8 text-blue-600" />
               </div>
               
               {/* FORCE ONLINE STATUS: Green Dot always visible */}
               <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
            </div>
          </div>
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{AI_USER.fullName}</div>
            <div className="text-sm text-green-500">Online</div> 
          </div>
        </button>

        {/* SEPARATOR */}
        <div className="divider my-0 px-3 opacity-50"></div>

        {/* REGULAR USERS */}
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

