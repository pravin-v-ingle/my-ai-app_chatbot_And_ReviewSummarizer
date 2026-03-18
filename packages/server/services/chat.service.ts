import OpenAI from 'openai';
import { conversationsRepository } from '../repository/conversations.repository';
import template from '../prompts/chatbot.txt';
import fs from 'fs';
import path from 'path';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const botInstructions = template.replace('{{parkInfo}}', parkInfo);
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = {
   id: string;
   message: string;
};
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         instructions: botInstructions,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 200,
         previous_response_id:
            conversationsRepository.getPreviousResponseId(conversationId),
      });

      conversationsRepository.setPreviousResponseId(
         conversationId,
         response.id
      );

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
