"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { io, Socket } from "socket.io-client"

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string
  userRole: "DOCTOR" | "PATIENT"
  videoSessionId: string | null | undefined
}

export function VideoCallModal({
  isOpen,
  onClose,
  appointmentId,
  userRole,
}: VideoCallModalProps) {
  const [isCallAccepted, setIsCallAccepted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const initializeWebRTC = async () => {
      try {
        setIsLoading(true)
        setMediaError(null)
        const socket = io(process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || "http://localhost:3001")
        socketRef.current = socket
        socket.emit("join-room", appointmentId)

        let stream: MediaStream | null = null
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        } catch (mediaErr: any) {
          console.warn("Video+audio failed, trying audio only:", mediaErr.name)
          if (mediaErr.name === "NotReadableError" || mediaErr.name === "NotFoundError" || mediaErr.name === "AbortError") {
            try {
              stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
              setMediaError("Camera unavailable — joined with audio only. Close other apps using your camera and retry.")
              toast.warning("Camera unavailable. Joined with audio only.")
            } catch (audioErr) {
              console.error("Audio-only also failed:", audioErr)
              setMediaError("Could not access camera or microphone. Please check browser permissions.")
              toast.error("Could not access camera or microphone.")
            }
          } else if (mediaErr.name === "NotAllowedError") {
            setMediaError("Camera/microphone permission denied. Please allow access in your browser settings.")
            toast.error("Permission denied. Please allow camera/microphone access.")
          } else {
            setMediaError("Failed to access media devices: " + mediaErr.message)
            toast.error("Failed to access media devices.")
          }
        }

        if (!stream) { setIsLoading(false); return }

        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream

        const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }
        const peerConnection = new RTCPeerConnection(configuration)
        peerConnectionRef.current = peerConnection

        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0]
        }

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) socket.emit("ice-candidate", { appointmentId, candidate: event.candidate })
        }

        peerConnection.oniceconnectionstatechange = () => {
          if (peerConnection.iceConnectionState === "connected") setIsLoading(false)
        }

        socket.on("ice-candidate", async (candidate: RTCIceCandidateInit) => {
          try { await peerConnection.addIceCandidate(candidate) } catch (error) { console.error("Error adding ICE candidate:", error) }
        })

        if (userRole === "DOCTOR") {
          const offer = await peerConnection.createOffer()
          await peerConnection.setLocalDescription(offer)
          socket.emit("offer", { appointmentId, offer })
        }

        socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
          try {
            await peerConnection.setRemoteDescription(offer)
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            socket.emit("answer", { appointmentId, answer })
          } catch (error) { console.error("Error handling offer:", error) }
        })

        socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
          try { await peerConnection.setRemoteDescription(answer) } catch (error) { console.error("Error handling answer:", error) }
        })

        socket.on("call-accepted", () => setIsCallAccepted(true))
        socket.on("call-rejected", () => { toast.error("Call was rejected"); onClose() })

      } catch (error) {
        console.error("Error initializing WebRTC:", error)
        toast.error("Failed to initialize video call")
      } finally {
        setIsLoading(false)
      }
    }

    initializeWebRTC()

    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop())
      peerConnectionRef.current?.close()
      socketRef.current?.disconnect()
    }
  }, [isOpen, userRole, appointmentId, onClose])

  const handleAcceptCall = () => {
    socketRef.current?.emit("call-accepted", { appointmentId })
    setIsCallAccepted(true)
  }

  const handleRejectCall = () => {
    socketRef.current?.emit("call-rejected", { appointmentId })
    onClose()
  }

  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setIsMuted(!isMuted) }
  }

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; setIsVideoOff(!isVideoOff) }
  }

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    peerConnectionRef.current?.close()
    socketRef.current?.disconnect()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[820px] p-0 bg-transparent border-none shadow-none overflow-hidden">
        <DialogTitle className="sr-only">Video Call</DialogTitle>
        <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col" style={{ minHeight: "520px" }}>

          {/* ── Header bar ── */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 border-b border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-white font-semibold text-sm">Secure Video Call</span>
            <span className="text-slate-400 text-xs ml-auto">
              {userRole === "DOCTOR" ? "Doctor" : "Patient"} · End-to-End Encrypted
            </span>
          </div>

          {/* ── Video area ── */}
          <div className="relative flex-1 bg-slate-900 overflow-hidden" style={{ minHeight: "380px" }}>
            {/* Remote video — absolute fill so it always covers the area regardless of flex height */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <p className="text-white font-medium">Connecting...</p>
                <p className="text-slate-400 text-sm mt-1">Setting up secure connection</p>
              </div>
            )}

            {/* Media error banner */}
            {mediaError && (
              <div className="absolute top-3 left-3 right-3 z-20">
                <div className="bg-amber-500/90 backdrop-blur-sm border border-amber-400/50 text-amber-950 text-xs font-medium rounded-xl px-4 py-2.5 flex items-start gap-2 shadow-xl">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {mediaError}
                </div>
              </div>
            )}

            {/* Local video (picture-in-picture) */}
            <div className="absolute bottom-3 right-3 z-20">
              <div className="w-28 h-20 sm:w-40 sm:h-28 rounded-xl overflow-hidden border-2 border-blue-500/60 shadow-xl shadow-black/50 bg-slate-900">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center">
            {!isCallAccepted && userRole === "PATIENT" ? (
              // ── Incoming call controls ──
              <div className="flex gap-4">
                <button
                  onClick={handleRejectCall}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-110 active:scale-95">
                    <PhoneOff className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-slate-400">Decline</span>
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all hover:scale-110 active:scale-95">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-slate-400">Accept</span>
                </button>
              </div>
            ) : (
              // ── In-call controls ──
              <div className="flex items-center gap-4">
                <button onClick={toggleMute} className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 ${isMuted ? "bg-red-500 shadow-red-500/30" : "bg-slate-700 hover:bg-slate-600 shadow-black/30"}`}>
                    {isMuted ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
                  </div>
                  <span className="text-xs text-slate-400">{isMuted ? "Unmute" : "Mute"}</span>
                </button>

                <button onClick={toggleVideo} className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 ${isVideoOff ? "bg-red-500 shadow-red-500/30" : "bg-slate-700 hover:bg-slate-600 shadow-black/30"}`}>
                    {isVideoOff ? <VideoOff className="h-5 w-5 text-white" /> : <Video className="h-5 w-5 text-white" />}
                  </div>
                  <span className="text-xs text-slate-400">{isVideoOff ? "Start Video" : "Stop Video"}</span>
                </button>

                <button onClick={endCall} className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-110 active:scale-95">
                    <PhoneOff className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-slate-400">End</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}