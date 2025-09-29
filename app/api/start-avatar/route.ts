import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Starting Avatar Session...");

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

    if (!session_id) {
        return Response.json(
            {error: 'Session ID is required'},
            {status: 400}
        )
    }

    console.log("Making request to start avatar with session_id:", session_id);

    const response = await fetch(`https://api.heygen.com/v1/streaming.start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': `${process.env.HEYGEN_API_KEY}`
        },
        body: JSON.stringify({
            session_id: session_id
        })
    })

    const resjson = await response.json()

    if(!response.ok) {
        console.error ('HeyGen API error', resjson)
        console.error('Full error details:', JSON.stringify(resjson, null, 2))
        console.error('Response status:', response.status)
        console.error('Response headers:', response.headers)
        return Response.json(
            {error: 'Failed to start avatar', details: resjson},
            {status: response.status}
        )
    }

    console.log('Avatar started successfully:', resjson)
    return Response.json(resjson)

    } catch (error) {
        console.error('Error creating session:', error)
        return Response.json(
            {error: 'Failed to create session', details: error instanceof Error ? error.message : 'Unknown error'},
            {status: 500}
        )
    }
}