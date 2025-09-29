import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Createing New HeyGen Session");

    if(!process.env.HEYGEN_API_KEY) {
        console.error("HEYGEN_API_KEY is not defined");
        return Response.json(
            {error: 'API key not configured'},
            {status: 500}
        )
    }

    try {
    const body = await req.json();
    console.log("Request Body: ", body);

    const response = await fetch('https://api.heygen.com/v1/streaming.new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${process.env.HEYGEN_API_KEY}`
        },
        body: JSON.stringify({
            quality: body.quality || 'medium',
            avatar_id : body.avatar_id || 'Marianne_ProfessionalLook_public',
            activity_idle_timeout : 3600,
            version: "v2"
        })
    })

    const resjson = await response.json()

    if(!response.ok) {
        console.error ('HeyGen API error', resjson.message)
        return Response.json(
            {error: 'Failed to create session', details: resjson.message},
            {status: response.status}
        )
    }

    console.log('Session created successfully:', resjson.data.session_id)
    return Response.json(resjson.data)

    } catch (error) {
        console.error('Error creating session:', error)
        return Response.json(
            {error: 'Failed to create session', details: error instanceof Error ? error.message : 'Unknown error'},
            {status: 500}
        )
    }
}