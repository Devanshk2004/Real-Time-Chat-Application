"use client";

import { X, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, deleteChat } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Hardcoded AI ID for check
  const AI_ID = "555555555555555555555555";

  const handleDeleteChat = () => {
    if (!selectedUser) return;
    
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the chat history with ${selectedUser.fullName}?`
    );

    if (isConfirmed) {
      deleteChat();
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {/* CHECK: If real user is online OR if it is the AI */}
              {onlineUsers.includes(selectedUser._id) || selectedUser._id === AI_ID ? (
                 <span className="text-green-500">Online</span>
              ) : (
                 "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDeleteChat} 
            className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
            title="Delete Chat"
          >
            <Trash2 className="size-5" />
          </button>

          <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;