const ALLOWED_ORIGIN =
    "https://soumyadascse.github.io";

const SYSTEM_PROMPT = `
You are Love AI ❤️, a romantic and playful AI assistant created
by Soumya specifically for Sharmila.

You are part of the website:
"Soumya ❤️ Sharmila"

Information intentionally provided by Soumya:

- Soumya's name is Soumya.
- Her name is Sharmila.
- Soumya remembers the first time he held Sharmila's hand.
- They shared their first hug.
- They shared their first kiss.
- Soumya says he misses Sharmila every second.
- Soumya says he loves Sharmila more than anything.
- Soumya goes to office with Sharmila.
- Soumya returns home with Sharmila.
- Sharmila holds Soumya's hands.
- Soumya created this website especially for Sharmila.

Personality:
- Romantic
- Warm
- Playful
- Sweet
- Slightly teasing
- Respectful
- Keep answers reasonably short
- Use ❤️ and 😊 naturally

Do not invent memories, dates, events, or personal information.

When answering questions about Soumya, say that you are
basing your answer on what Soumya wrote on the website.

If asked whether Soumya loves Sharmila:
Based on what Soumya wrote on the website, he clearly
expresses very strong love for Sharmila.

If asked whether Soumya misses Sharmila:
Mention that Soumya specifically wrote:
"I miss you every second."

You are a fun part of their website, not a replacement
for real communication between Soumya and Sharmila.
`;

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
}

function jsonResponse(data, status = 200) {
    return new Response(
        JSON.stringify(data),
        {
            status,
            headers: corsHeaders()
        }
    );
}

export default {
    async fetch(request, env) {

        // CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders()
            });
        }

        // Only POST is allowed
        if (request.method === "GET") {
            return jsonResponse({
                status: "online",
                message: "Love AI API is running ❤️",
                geminiKeyConfigured: !!env.GEMINI_API_KEY
            });
        }

        if (request.method !== "POST") {
            return jsonResponse(
                {
                    error: "Method not allowed."
                },
                405
            );
        }

        try {

            const body = await request.json();

            const message =
                typeof body.message === "string"
                    ? body.message.trim()
                    : "";

            if (!message) {
                return jsonResponse(
                    {
                        error: "Please enter a message."
                    },
                    400
                );
            }

            if (message.length > 1000) {
                return jsonResponse(
                    {
                        error:
                            "Please keep your message under 1000 characters."
                    },
                    400
                );
            }

            if (!env.GEMINI_API_KEY) {
                return jsonResponse(
                    {
                        error:
                            "GEMINI_API_KEY is not configured in Cloudflare."
                    },
                    500
                );
            }

            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
                encodeURIComponent(env.GEMINI_API_KEY),
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [
                                {
                                    text: SYSTEM_PROMPT
                                }
                            ]
                        },

                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: message
                                    }
                                ]
                            }
                        ],

                        generationConfig: {
                            temperature: 0.8,
                            maxOutputTokens: 400
                        }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(
                    "Gemini error:",
                    JSON.stringify(data)
                );

                return jsonResponse(
                    {
                        error:
                            data?.error?.message ||
                            "Gemini could not answer right now."
                    },
                    502
                );
            }

            const reply =
                data?.candidates?.[0]?.content?.parts
                    ?.map(part => part.text || "")
                    .join("")
                    .trim();

            if (!reply) {
                return jsonResponse(
                    {
                        error:
                            "Love AI couldn't generate a response."
                    },
                    502
                );
            }

            return jsonResponse({
                reply: reply
            });

        } catch (error) {

            console.error(
                "Worker error:",
                error
            );

            return jsonResponse(
                {
                    error:
                        "Something went wrong. Please try again. ❤️"
                },
                500
            );
        }
    }
};
