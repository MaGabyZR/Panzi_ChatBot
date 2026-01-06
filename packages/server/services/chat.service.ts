import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';

//Create a new instance of OpenAI with our API Key. Implementation detail => not to be exposed.
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

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
      //Send to OpenAI
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         instructions,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 250,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });
      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
