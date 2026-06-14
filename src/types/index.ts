export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  /** 在逐字流式输出过程中为 true */
  isStreaming?: boolean;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

export type ChatAction =
  | { type: "HYDRATE"; payload: ChatState }
  | { type: "CREATE_CONVERSATION"; payload: Conversation }
  | { type: "SET_ACTIVE"; payload: string }
  | { type: "ADD_MESSAGE"; payload: { conversationId: string; message: Message } }
  | {
      type: "UPDATE_MESSAGE";
      payload: {
        conversationId: string;
        messageId: string;
        content: string;
        isStreaming: boolean;
      };
    }
  | { type: "UPDATE_TITLE"; payload: { conversationId: string; title: string } }
  | { type: "DELETE_CONVERSATION"; payload: string };
