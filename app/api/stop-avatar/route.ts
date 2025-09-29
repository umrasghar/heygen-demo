import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Stopping Avatar Session...");

    if(!process.env.HEYGEN_API_KEY) {
        console.error("HEYGEN_API_KEY is not defined");
        return Response.json(
            {error: 'API key not configured'},
            {status: 500}
        )
    }

    try {
    const { session_id } = await req.json();
    console.log("Session ID: ", session_id);

    const response = await fetch('https://api.heygen.com/v1/streaming.stop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${process.env.HEYGEN_API_KEY}`
        },
        body: JSON.stringify({ session_id })
    })

    const resjson = await response.json()

    if(!response.ok) {
        console.error ('HeyGen API error', resjson)
        return Response.json(
            {error: 'Failed to stop session', details: resjson},
            {status: response.status}
        )
    }

    console.log('Session Stopped successfully:', resjson.status)
    return Response.json(resjson)

    } catch (error) {
        console.error('Error creating session:', error)
        return Response.json(
            {error: 'Failed to create session', details: error instanceof Error ? error.message : 'Unknown error'},
            {status: 500}
        )
    }
}