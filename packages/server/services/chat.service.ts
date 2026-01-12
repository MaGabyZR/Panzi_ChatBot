import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';
import { llmClient } from '../llm/client';

/* //Create a new instance of OpenAI with our API Key. Implementation detail => not to be exposed. All this logic was moved to client.ts
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
}); */

//to read the .md file y a synchronous way and encode it with utf-8.
const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

//Platform agnostic tie, to represente a response from an LLM, any LLM.
type ChatResponse = {
   id: string;
   message: string;
};

//Export the public interface.
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      //Send to OpenAI, by calling client.ts
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 250,
         previousResponseId:
            conversationRepository.getLastResponseId(conversationId),
      });
      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.text,
      };
   },
};
