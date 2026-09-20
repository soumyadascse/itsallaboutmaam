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

IMPORTANT:
Do not claim that you can read Soumya's private thoughts.

When answering questions about Soumya, say that you are
basing your answer on what Soumya wrote on this website.

Do not invent memories, dates, events, or personal information.

If asked:
"Does Soumya love me?"

You can say that based on what Soumya wrote on the website,
he clearly expresses very strong love for Sharmila.

If asked:
"Does Soumya miss me?"

Mention that Soumya specifically wrote:
"I miss you every second."

You are a fun part of their website, not a replacement for
real communication between Soumya and Sharmila.
`;

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
}

function jsonResponse(data, status = 200) {
    return new Response(
        JSON.stringify(data),
        {
            status: status,
            headers: corsHeaders()
        }
    );
}

export default {
    async fetch(request, env) {

        // -----------------------------------------
        // CORS preflight
        // -----------------------------------------
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders()
            });
        }

        // -----------------------------------------
        // GET - health check
        // -----------------------------------------
        if (request.method === "GET") {
            return jsonResponse({
                status: "online",
                message: "Love AI API is running ❤️",
                geminiKeyConfigured:
                    !!env.GEMINI_API_KEY
            });
        }

        // -----------------------------------------
        // Only POST is allowed for chat
        // -----------------------------------------
        if (request.method !== "POST") {
            return jsonResponse(
                {
                    error: "Method not allowed."
                },
                405
            );
        }

        try {

            // -----------------------------------------
            // Read request
            // -----------------------------------------
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

            // -----------------------------------------
            // Check Gemini API key
            // -----------------------------------------
            if (!env.GEMINI_API_KEY) {
                return jsonResponse(
                    {
                        error:
                            "GEMINI_API_KEY is not configured in Cloudflare."
                    },
                    500
                );
            }

            // -----------------------------------------
            // Gemini Interactions API
            // -----------------------------------------
            const geminiResponse = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/interactions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key":
                            env.GEMINI_API_KEY
                    },

                    body: JSON.stringify({

                        model: "gemini-3.6-flash",

                        input: message,

                        system_instruction:
                            SYSTEM_PROMPT,

                        store: false
                    })
                }
            );

            // -----------------------------------------
            // Read Gemini response
            // -----------------------------------------
            const data =
                await geminiResponse.json();

            console.log(
                "Gemini status:",
                geminiResponse.status
            );

            console.log(
                "Gemini response:",
                JSON.stringify(data)
            );

            // -----------------------------------------
            // Gemini API error
            // -----------------------------------------
            if (!geminiResponse.ok) {

                return jsonResponse(
                    {
                        error:
                            data?.error?.message ||
                            "Gemini API request failed."
                    },
                    502
                );
            }

            // -----------------------------------------
            // Extract text from Interactions API
            //
            // Current REST response:
            //
            // steps: [
            //   {
            //     type: "model_output",
            //     content: [
            //       {
            //         type: "text",
            //         text: "..."
            //       }
            //     ]
            //   }
            // ]
            // -----------------------------------------

            let reply = "";

            if (Array.isArray(data?.steps)) {

                for (const step of data.steps) {

                    if (
                        step?.type !==
                        "model_output"
                    ) {
                        continue;
                    }

                    if (
                        !Array.isArray(
                            step.content
                        )
                    ) {
                        continue;
                    }

                    for (
                        const content
                        of step.content
                    ) {

                        if (
                            content?.type ===
                            "text"
                        ) {

                            reply +=
                                content.text ||
                                "";
                        }
                    }
                }
            }

            reply = reply.trim();

            // -----------------------------------------
            // Fallback for output_text
            // -----------------------------------------
            if (!reply) {

                reply =
                    typeof data?.output_text ===
                    "string"
                        ? data.output_text.trim()
                        : "";
            }

            // -----------------------------------------
            // Empty response
            // -----------------------------------------
            if (!reply) {

                console.error(
                    "Gemini returned no text:",
                    JSON.stringify(data)
                );

                return jsonResponse(
                    {
                        error:
                            "Gemini returned an empty response."
                    },
                    502
                );
            }

            // -----------------------------------------
            // Success
            // -----------------------------------------
            return jsonResponse({
                reply: reply
            });

        } catch (error) {

            console.error(
                "Worker error:",
                error?.message || error
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
