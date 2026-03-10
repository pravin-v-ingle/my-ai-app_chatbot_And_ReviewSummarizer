const conversations = new Map<string, string>(); // save these in db for production use, this is just for demo purposes

export const conversationsRepository = {
   getPreviousResponseId: (conversationId: string) => {
      return conversations.get(conversationId);
   },
   setPreviousResponseId: (conversationId: string, responseId: string) => {
      conversations.set(conversationId, responseId);
   },
};
