import axios from "axios";
import { ParseEvent, createParser } from "eventsource-parser";
import { Readable } from "stream";

export type ChatGPTAgent = "user" | "system";
export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export type OpenAIStreamPayload = {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
};
export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      responseType: "stream",
    }
  );
  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParseEvent) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            console.log("text", text);
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }
      const parser = createParser(onParse);
      for await (const chunk of res.data) {
        parser.feed(decoder.decode(new Uint8Array(chunk)));
      }
    },
  });
  return stream;
}
