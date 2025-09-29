import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log("Sending Message to Avatar...");
    try{
        const {session_id, text, task_type = 'chat'} = await req.json()

        console.log(`Sending Message: ${text} (${task_type} mode)`);

        const response = await fetch('https://api.heygen.com/v1/streaming.task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': `${process.env.HEYGEN_API_KEY}`
            },
            body: JSON.stringify({
                session_id,
                text,
                task_type
            })
        })

        const data = await response.json()

        if(!response.ok){
            console.error("Send message failed:", data)
            return Response.json(
                {error: 'Failed to send message', details: data},
                {status: response.status}
            )
        }

        console.log('Message sent successfully!')
        return Response.json(data)
    } catch (error) {
        console.error('Send message error:', error)
        return Response.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}