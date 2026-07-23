/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { User, Star, Calendar, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Doctor } from "@/lib/doctor";
import ChatModal from "./chat-modal";
import { getOrCreateChatRoomByClerkIds } from "@/actions/message";
import { useUser } from "@clerk/nextjs";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleMessageClick = async () => {
    if (!user?.id) {
      alert("Please sign in to send messages");
      return;
    }
    if (!doctor?.clerkUserId) {
      alert("Invalid doctor information");
      return;
    }
    setLoading(true);
    try {
      const chatRoom = await getOrCreateChatRoomByClerkIds(doctor.clerkUserId, user.id);
      if (!chatRoom) throw new Error("Failed to create or find chat room");
      setChatRoomId(chatRoom.id);
      setIsChatOpen(true);
    } catch (err: any) {
      console.error("Chat error:", err);
      alert(err?.message || "Failed to start chat. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />

      <div className="p-5">
        {/* Doctor info row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md shadow-blue-500/20">
            {doctor.imageUrl ? (
              <img src={doctor.imageUrl} alt={doctor.name || "Doctor"} className="w-14 h-14 object-cover" />
            ) : (
              <User className="h-7 w-7 text-white" />
            )}
          </div>

          {/* Name + specialty */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight truncate">
                {doctor.name}
              </h3>
              <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs flex-shrink-0 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              {doctor.specialty}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {doctor.experience} years experience
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {doctor.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 text-sm shadow-md shadow-blue-500/20"
          >
            <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
              <Calendar className="h-4 w-4" />
              View & Book
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={handleMessageClick}
            disabled={loading}
            className="rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 gap-2 text-sm transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
            {loading ? "" : "Message"}
          </Button>
        </div>
      </div>

      {chatRoomId && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          doctor={doctor}
          patient={user}
          chatRoomId={chatRoomId}
        />
      )}
    </div>
  );
}