import { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";
import { FC, ReactNode, createContext, useState } from "react";

const emptyFn = () => {};
const defaultValues = {
  messages: [],
  isMessageUpdating: false,
  addMessage: emptyFn,
  updateMessage: emptyFn,
  removeMessage: emptyFn,
  setIsMessageUpdating: emptyFn,
};
export const MessagesContext = createContext<{
  messages: Message[];
  isMessageUpdating: boolean;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
  removeMessage: (id: string) => void;
  setIsMessageUpdating: (isUpdating: boolean) => void;
}>(defaultValues);

type MessagesProviderProps = {
  children: ReactNode;
};
export const MessagesProvider: FC<MessagesProviderProps> = ({ children }) => {
  const [isMessageUpdating, setIsMessageUpdating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      text: "Hi, how can I help you?",
      isUserMessage: false,
    },
  ]);
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (
    id: string,
    updateFn: (prevText: string) => string
  ) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === id) {
          return {
            ...message,
            text: updateFn(message.text),
          };
        }
        return message;
      })
    );
  };
  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        isMessageUpdating,
        addMessage,
        removeMessage,
        updateMessage,
        setIsMessageUpdating,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
