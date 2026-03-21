import { conversationsRepository } from '../repositories/conversations.repository';
import template from '../prompts/chatbot.txt';
import fs from 'fs';
import path from 'path';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const botInstructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions: botInstructions,
         prompt,
         temperature: 0.2,
         maxTokens: 200,
         previousResponseId:
            conversationsRepository.getPreviousResponseId(conversationId),
      });

      conversationsRepository.setPreviousResponseId(
         conversationId,
         response.id
      );

      return {
         id: response.id,
         message: response.text,
      };
   },
};
