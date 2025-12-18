import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

//Create a new instance of OpenAI with our API Key. Implementation detail => not to be exposed.
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});
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
