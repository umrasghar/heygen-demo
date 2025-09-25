'use client'

import { useState } from 'react';
import { useAvatarSession } from './hooks/useAvatarSession'
import { stat } from 'fs';


export default function Home() {

  const {
    status,
    sessionData,
    isConnected,
    vidoRef,
    createSession,
    disconnectSession
  } = useAvatarSession()

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

      <div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'>
        <video 
          ref= {vidoRef}
          autoPlay
          playsInline
          className={`object-contain w-full h-full ${isConnected ? 'block' : 'hidden'}`}
        />

        {!isConnected && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <p className='text-gray-500 text-lg'>
              {status.includes('Creating') || status.includes('Connecting')
                ? 'Loading...'
                : 'Avatar will appear here.'
              }
            </p>
          </div>
        )}

      </div>



      <div className='mt-4'>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
          onClick={createSession}
          disabled={status.includes('Creating') || status.includes('Connecting') || isConnected}
        >
          Start Session
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
          onClick={disconnectSession}
          disabled={!isConnected}
        >
          End Session
        </button>


      </div>
    
    </main>
  )
}