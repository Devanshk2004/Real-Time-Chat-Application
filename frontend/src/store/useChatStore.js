import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const AI_ID = "555555555555555555555555";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isAiTyping: false, // NEW STATE: To track if AI is thinking

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      // 1. HANDLE AI CHAT
      if (selectedUser._id === AI_ID) {
        const myId = useAuthStore.getState().authUser._id;
        
        // Create a temporary message to show IMMEDIATELY
        const tempUserMsg = {
             _id: Date.now(), 
             senderId: myId,
             receiverId: AI_ID,
             text: messageData.text,
             createdAt: new Date().toISOString(),
        };

        // Add user message to UI instantly & Set Typing State
        set({ 
            messages: [...messages, tempUserMsg], 
            isAiTyping: true 
        });

        // Send to Backend
        const res = await axiosInstance.post(`/ai/chat`, { text: messageData.text });

        // Append AI Response & Stop Typing
        set({
            messages: [...get().messages, res.data],
            isAiTyping: false
        });

      } else {
        // 2. HANDLE REGULAR CHAT
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      set({ isAiTyping: false }); // Reset typing on error
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));