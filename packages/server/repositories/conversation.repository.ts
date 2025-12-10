//Implementation detail, we should not expose this. For now it is stored in memory, in the future should be moved to a db.
//Map conversationId to lastReponseId
const conversations = new Map<string, string>();

//Export the public interface of the module only.
export const conversationRepository = {
   getLastResponseId(conversationId: string) {
      return conversations.get(conversationId);
   },
   setLastResponseId(conversationId: string, responseId: string) {
      conversations.set(conversationId, responseId);
   },
};
