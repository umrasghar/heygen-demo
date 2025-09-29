'use client'
import { error } from "console"
import { connect } from "http2"
import { Participant, Room, RoomEvent, Track } from "livekit-client"
import { useCallback, useRef, useState } from "react"

   

interface SessionData {
  session_id: string
  url: string
  access_token: string
}

export const useAvatarSession = () => {
    const [status, setStatus] = useState('Ready to connect');
    const [sessionData, setSessionData] =  useState<SessionData | null>(null)
    const [room, setRoom] = useState<Room | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)

    const createSession = useCallback(async () => {
        setStatus('Creating Session...')
        try{
            const response = await fetch('api/create-session', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    quality: 'medium',
                    avatar_id: 'Marianne_ProfessionalLook_public'
                })
            })

            if(!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            setSessionData(data)
            setStatus('Session Created. Connecting to Livekit...')

            await connectToLiveKit(data)
        } catch (error){
            console.error('Session creation failed:', error)
            setStatus(`Error: ${error instanceof Error ? error.message: 'Unkown Error'}`)
        }

    }, [])

    const connectToLiveKit = useCallback(async (sessionData: SessionData) => {
        try{
            await startAvatar(sessionData.session_id)
            setStatus('Connecting to LiveKit Room...')

            const newRoom = new Room()

            newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                console.log('Track Subscribed:', track.kind, participant.identity)
                if(track.kind === Track.Kind.Video && videoRef.current) {
                    const element = track.attach()
                    videoRef.current.srcObject = element.srcObject
                    videoRef.current.muted = false
                    console.log('Video track attached')
                }
                if(track.kind === Track.Kind.Audio && videoRef.current) {
                    const audioElement = track.attach()

                }

                setStatus('Avatar Video Connected!')
                setIsConnected(true)
            })

            newRoom.on(RoomEvent.Connected, () => {
                console.log('Connected to LiveKit Room')
                setStatus('Connected to LiveKit Room, waiting for Avatar')
            })

            newRoom.on(RoomEvent.Disconnected, (reason) => {
                console.log('Disconnected from Livekit Room:', reason)
                setStatus('Disconnected from LiveKit Room')
            })

            newRoom.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
                console.log('Connection Quality:', quality, participant?.identity)
            })

            await  newRoom.connect(sessionData.url, sessionData.access_token)
            setRoom(newRoom)

            

        } catch (error) {
            console.error('LiveKit connection failed', error)
            setStatus(`LiveKit Error: ${error instanceof Error ? error.message : 'Connection Failed'}`)
        }

    }, [])

    const startAvatar = useCallback(async (sessionId: string) => {
        setStatus('Starting Avatar...')

        try {
            const response = await fetch('api/start-avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({session_id: sessionId})
            })

            if (!response.ok){
                const errorData = await response.json()
                console.error('Start avatar failed:', errorData)
                throw new Error(`Failed to start Avatar: ${response.status} - ${JSON.stringify(errorData)}`)
            }

            const result = await response.json()
            console.log('Avatar started successfully:', result)
            setStatus('Avatar session started successfully!')
        } catch (error) {
            console.error('Error starting avatar:', error)
            setStatus(`Avatar Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            throw error
        }

    }, [])

    const disconnectSession = useCallback(async () => {
        setStatus('Disconnecting Avatar...')

        if(sessionData){
            await fetch('/api/stop-avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({session_id: sessionData.session_id})
            }) 
        }

        if(room) {
            room.disconnect()
            setRoom(null)
        }

        if(videoRef.current){
            videoRef.current.srcObject = null
        }

        setSessionData(null)
        setIsConnected(false)

        setStatus('Disconnected Avatar Successfully!')


    }, [sessionData, room])

    const sendMessage = useCallback(async (text: string, task_type: 'chat' | 'repeat') => {

        if(!sessionData || !text.trim()) {
            console.error('Cannot send the message: no session id or empty text')
            return
        }

        try {
            setStatus(`Sending Message (${task_type}) mode...`)

            const response = await fetch ('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionData.session_id,
                    text: text.trim(),
                    task_type: task_type
                })
            })

            if(!response.ok){
                throw new Error(`Failed to send message: ${response.status}`)
            }

            setStatus('Message send successfully')

        } catch(error) {
            console.error('Send Message failed', error)
            setStatus(`Message error: ${error instanceof Error ? error.message : 'Send failed'}`)
        }


    }, [sessionData])

    return {
        status,
        sessionData,
        isConnected,
        videoRef,
        createSession,
        disconnectSession,
        sendMessage        
    }
    
}