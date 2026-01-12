import OpenAI from 'openai';

//Here we hide the complexity of talking to an LLM and only exporting the generateText for talking to an LLM.

//Create an OpenAI object.
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

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
      const response = await client.responses.create({
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
};
