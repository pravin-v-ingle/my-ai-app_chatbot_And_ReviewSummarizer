import OpenAI from 'openai';
import ollama from 'ollama';
import { InferenceClient } from '@huggingface/inference';
import systemPromt from './prompts/summarizeReviews.txt';

const openAIclient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

type GenerateTextOption = {
   model?: string;
   instructions?: string;
   prompt: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      instructions,
      prompt,
      temperature = 0.2,
      maxTokens = 300,
      previousResponseId,
   }: GenerateTextOption): Promise<GenerateTextResult> {
      const response = await openAIclient.responses.create({
         model,
         instructions,
         input: prompt,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      });
      return {
         id: response.id,
         text: response.output_text,
      };
   },
   async summarizeReviews(reviews: string) {
      // const output = await inferenceClient.summarization({
      //    model: 'facebook/bart-large-cnn',
      //    inputs: text,
      //    provider: 'hf-inference',
      // });
      // return output.summary_text;
      const response = await ollama.chat({
         model: 'tinyllama',
         messages: [
            {
               role: 'system',
               content: systemPromt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return response.message.content;
   },
};
