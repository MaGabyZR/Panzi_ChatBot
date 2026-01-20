import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from '../prompts/summarize-reviews.txt';

//Here we hide the complexity of talking to an LLM and only exporting the generateText for talking to an LLM.

//Create an OpenAI object.
const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

//Create an HuggingFace cliente object.
const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

//export the object llClient and give it a single method generateText, which is the public interface of this module. This is the only you have to modify if you change your LLM model, for ex. to Gemini.
export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 300,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      });

      //Return an object with 2 properties, id and text.
      return {
         id: response.id,
         text: response.output_text,
      };
   },
   //Define a new method for summarizing reviews with HuggingFace.
   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },

            {
               role: 'user',
               content: reviews,
            },
         ],
      });

      return chatCompletion.choices[0]?.message.content || '';
   },
};
