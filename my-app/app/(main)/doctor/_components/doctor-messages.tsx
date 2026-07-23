/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { getUserChatRooms } from "@/actions/message";
import DoctorChatModal from "./doctor-chat-modal";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, User, ChevronRight, Loader2 } from "lucide-react";

export default function DoctorMessages() {
  const { user } = useUser();
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getUserChatRooms(user.id)
        .then((rooms) => setChatRooms(rooms || []))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const handleReply = (room: any) => {
    setSelectedRoom(room);
    setIsChatOpen(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Patient Messages</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {loading ? "Loading..." : `${chatRooms.length} conversation${chatRooms.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-14">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">No messages yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
              When patients message you, their conversations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {chatRooms.map((room) => {
              const patient = room.patient;
              const lastMessage = room.messages?.[0];
              return (
                <button
                  key={room.id}
                  onClick={() => handleReply(room)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md hover:shadow-blue-500/5 transition-all text-left group"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                    <User className="h-5 w-5 text-white" />
                  </div>

                  {/* Message preview */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {patient?.name || "Unknown Patient"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lastMessage
                        ? `${lastMessage.sender?.name || "Unknown"}: ${lastMessage.content}`
                        : "No messages yet."}
                    </p>
                  </div>

                  {/* Reply indicator */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Reply</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedRoom && (
        <DoctorChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          doctor={user}
          patient={selectedRoom.patient}
          chatRoomId={selectedRoom.id}
        />
      )}
    </div>
  );
}