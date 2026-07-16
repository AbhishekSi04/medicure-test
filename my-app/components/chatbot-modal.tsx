'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage, ChatMessage } from '@/actions/chatbot';
import { Bot, Send, User, Loader2, X, Sparkles, RefreshCw, ChevronDown, AlertTriangle } from 'lucide-react';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What are symptoms of the flu?",
  "How can I improve my sleep?",
  "Foods good for heart health?",
  "How to manage stress and anxiety?",
  "When should I see a doctor for a headache?",
  "What is a normal blood pressure range?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isUser = message.role === 'user';
  return (
    <div
      className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: `fadeSlideIn 0.3s ease forwards`, animationDelay: `${index * 0.05}s`, opacity: 0 }}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-gradient-to-br from-zinc-400 to-zinc-600'
          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot className="w-4 h-4 text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-800 dark:text-slate-100 rounded-bl-sm'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Track scroll position to show/hide scroll button
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(messageText, messages);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response.message };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
    setInput('');
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-950"
        style={{ animation: 'modalIn 0.25s ease forwards' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white leading-none">MediCure AI</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-blue-100">AI-Powered Health Assistant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="New conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-0 scroll-smooth"
          style={{ minHeight: 0, maxHeight: '420px' }}
        >
          {messages.length === 0 ? (
            /* Welcome screen */
            <div className="h-full flex flex-col items-center justify-center text-center py-4 px-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                MediCure Health Assistant
              </h3>
              <p className="text-xs text-zinc-500 dark:text-slate-400 mb-5 max-w-[280px]">
                Powered by RAG + LLM — I retrieve relevant medical knowledge to give you accurate, context-aware health information.
              </p>
              <div className="w-full space-y-2">
                <p className="text-xs font-medium text-zinc-400 dark:text-slate-500 mb-2">Try asking:</p>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-full text-left text-xs px-3 py-2 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} index={i} />
              ))}
              {isLoading && <TypingIndicator />}
              {error && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute bottom-20 right-4 w-8 h-8 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Disclaimer */}
        {messages.length > 0 && (
          <p className="text-[10px] text-center text-zinc-400 dark:text-slate-600 px-4 py-1 flex-shrink-0">
            Not a substitute for professional medical advice
          </p>
        )}

        {/* ── Input ── */}
        <div className="px-3 pb-3 pt-2 bg-white dark:bg-slate-900 border-t border-zinc-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-end gap-2 bg-zinc-100 dark:bg-slate-800 rounded-xl px-3 py-2 border border-zinc-200 dark:border-slate-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent resize-none text-sm text-zinc-800 dark:text-slate-100 placeholder-zinc-400 dark:placeholder-slate-500 outline-none leading-5 max-h-24 overflow-y-auto disabled:opacity-50"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-slate-600 text-center mt-1.5">
            Press <kbd className="bg-zinc-200 dark:bg-slate-700 px-1 rounded text-[9px]">Enter</kbd> to send · <kbd className="bg-zinc-200 dark:bg-slate-700 px-1 rounded text-[9px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}