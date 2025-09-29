'use client'

import { useState } from 'react';
import { useAvatarSession } from './hooks/useAvatarSession'
import { stat } from 'fs';


export default function Home() {

  const {
    status,
    sessionData,
    isConnected,
    videoRef,
    createSession,
    disconnectSession,
    sendMessage
  } = useAvatarSession()

  const [messageText, setMessageText] = useState('')
  const [taskType, setTaskType] = useState<'chat' | 'repeat'>('chat')

  const handleSendMessage = async () => {
    if(messageText.trim()) {
      await sendMessage(messageText, taskType)
      setMessageText('')
    }
  }



  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold">HeyGen LiveKit Demo</h1>
        <p className="mt-4 text-lg">Welcome to the HeyGen LiveKit Demo application!</p>
      </div>
   
      <div className="bg-white rounded-lg shadow-md p-6 m-4">
          <p>Status: {status}</p>
      </div>

      {sessionData && (
        <div className="bg-blue-50 rounded p-6 m-4">
          <p className='text-blue-800 font-medium'>Session ID: {sessionData.session_id}</p>
          <p className='text-blue-600 font-sm'>WebSocket URL: {sessionData.url}</p>
        </div>
      )}

      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-contain ${isConnected ? 'block' : 'hidden'}`}
        />
        
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-gray-500 text-lg">
                {status.includes('Creating') || status.includes('Connecting') 
                  ? 'Loading avatar...' 
                  : 'Avatar will appear here'
                }
              </p>
            </div>
          </div>
        )}
      </div>



      <div className="flex gap-4 mb-6">
        <button 
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          onClick={createSession}
          disabled={status.includes('Creating') || status.includes('Connecting') || isConnected}
        >
          Start Avatar Session
        </button>
        
        <button 
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium"
          onClick={disconnectSession}
          disabled={!isConnected}
        >
          End Session
        </button>
      </div>
      {isConnected && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Chat with Avatar</h3>
                  
                  {/* Mode Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Mode:
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="chat"
                          checked={taskType === 'chat'}
                          onChange={(e) => setTaskType(e.target.value as 'chat')}
                          className="mr-2"
                        />
                        Chat Mode (AI Responses)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="repeat"
                          checked={taskType === 'repeat'}
                          onChange={(e) => setTaskType(e.target.value as 'repeat')}
                          className="mr-2"
                        />
                        Repeat Mode (Direct Speech)
                      </label>
                    </div>
                  </div>

          <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={taskType === 'chat' 
                        ? "Ask the avatar anything..." 
                        : "Enter text for avatar to repeat..."
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || status.includes('Sending')}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
                    >
                      Send
                    </button>
                  </div>
        </div>
      )}
    
    </main>
  )
}