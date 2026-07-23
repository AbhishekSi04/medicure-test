/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../../../../components/ui/dialog';
import { User, Send, Loader2, MessageSquare, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { sendMessage, getChatHistory, convertClerkIdToUuuid } from '@/actions/message';

const SOCKET_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || "http://localhost:3002";

interface DoctorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: any;
  patient: any;
  chatRoomId: string;
}

interface Message {
  role: 'doctor' | 'patient';
  content: string;
  timestamp: string;
  senderName?: string;
  senderId?: string;
}

export default function DoctorChatModal({ isOpen, onClose, doctor, patient, chatRoomId }: DoctorChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history
  useEffect(() => {
    if (!isOpen || !chatRoomId) return;
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const history = await getChatHistory(chatRoomId);
        const doctorUUID = await convertClerkIdToUuuid(doctor.id);
        const formatted: Message[] = history.map((msg: any) => ({
          role: msg.senderId === doctorUUID ? 'doctor' : 'patient',
          content: msg.content,
          timestamp: new Date(msg.createdAt).toISOString(),
          senderName: msg.senderId === doctorUUID ? 'You' : patient?.name,
          senderId: msg.senderId,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, [isOpen, chatRoomId, doctor.id, patient?.name]);

  // Socket.IO connection
  useEffect(() => {
    if (!isOpen || !chatRoomId) return;
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("joinRoom", { chatRoomId });
    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.emit("leaveRoom", { chatRoomId });
      socket.disconnect();
    };
  }, [isOpen, chatRoomId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !socketRef.current || !chatRoomId || !doctor?.id) return;
    setIsLoading(true);
    const msg: Message = {
      role: 'doctor',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      senderName: doctor.name,
      senderId: doctor.id,
    };
    try {
      socketRef.current.emit("sendMessage", { chatRoomId, message: msg });
      await sendMessage({ chatRoomId, senderId: doctor.id, messageType: 'TEXT', content: inputMessage.trim() });
      setMessages(prev => [...prev, msg]);
      setInputMessage('');
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 gap-0">
        <DialogTitle className="sr-only">Chat with Patient</DialogTitle>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex-shrink-0">
          {/* Patient avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{patient?.name || 'Patient'}</p>
            <p className="text-blue-200 text-xs">Patient</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* ── Messages area ── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
          style={{
            background: "var(--chat-bg, #f8fafc)",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.04) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        >
          <style jsx>{`
            :global(.dark) { --chat-bg: #020617; }
          `}</style>

          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <MessageSquare className="h-7 w-7 text-blue-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No messages yet</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs max-w-[200px]">Start the conversation with your patient</p>
            </div>
          ) : (
            (() => {
              let lastDate: string | null = null;
              return messages.map((message, index) => {
                const messageDate = formatDate(message.timestamp);
                const showDate = messageDate !== lastDate;
                lastDate = messageDate;
                const isDoctor = message.role === 'doctor';

                return (
                  <div key={`msg-${index}`}>
                    {/* Date separator */}
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 backdrop-blur-sm">
                          {messageDate}
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`flex items-end gap-2 mb-1.5 ${isDoctor ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 ${isDoctor ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <User className={`h-3.5 w-3.5 ${isDoctor ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[72%] group`}>
                        {/* Sender name */}
                        <p className={`text-[10px] font-semibold mb-1 px-1 ${isDoctor ? 'text-right text-blue-600 dark:text-blue-400' : 'text-left text-slate-500 dark:text-slate-400'}`}>
                          {isDoctor ? 'You (Doctor)' : (patient?.name || 'Patient')}
                        </p>

                        <div
                          className={`relative px-4 py-2.5 rounded-2xl shadow-sm transition-shadow group-hover:shadow-md ${
                            isDoctor
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                          <p className={`text-[10px] mt-1.5 ${isDoctor ? 'text-blue-100/80 text-right' : 'text-slate-400 dark:text-slate-500 text-right'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ── */}
        <div className="flex-shrink-0 px-4 py-3.5 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* Text input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your reply..."
                disabled={isLoading || isLoadingHistory}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:border-transparent text-sm transition-all disabled:opacity-50"
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isLoadingHistory}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25 disabled:shadow-none transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <Send className="h-4 w-4 text-white translate-x-px" />
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}