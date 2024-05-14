"use client";
import { MessagesContext } from "@/contexts/messages";
import { cn } from "@/lib/utils";
import React, { FC, HTMLAttributes, useContext } from "react";
import MarkdownLite from "./MarkdownLite";
type ChatMessagesProps = HTMLAttributes<HTMLDivElement>;

const ChatMessages: FC<ChatMessagesProps> = ({ className, ...restProps }) => {
  const { messages, isMessageUpdating } = useContext(MessagesContext);
  const inverseMessages = [...messages].reverse();
  return (
    <div
      {...restProps}
      className={cn(
        "flex bg-lime-200 flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch",
        className
      )}
    >
      <div className="flex-1 flex-grow" />
      {inverseMessages.map((message) => (
        <div key={message.id} className="chat-message">
          <div
            className={cn("flex items-end", {
              "justify-end": message.isUserMessage,
            })}
          >
            <div
              className={cn(
                "flex flex-col rounded space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden",
                {
                  "order-1 items-end": message.isUserMessage,
                  "order-2 items-start": !message.isUserMessage,
                }
              )}
            >
              <p
                className={cn("px-4 py-2 rounded-lg", {
                  "bg-blue-600 text-white": message.isUserMessage,
                  "bg-gray-200 text-gray-900": !message.isUserMessage,
                })}
              >
                <MarkdownLite text={message.text} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
