"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators/message";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import React, {
  FC,
  HtmlHTMLAttributes,
  useState,
  KeyboardEvent,
  useContext,
  useEffect,
} from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import axios from "axios";
import { MessagesContext } from "@/contexts/messages";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

type ChatInputProps = HtmlHTMLAttributes<HTMLDivElement>;

const ChatInput: FC<ChatInputProps> = ({ className, ...restProps }) => {
  const [input, setInput] = useState("");
  const {
    messages,
    addMessage,
    removeMessage,
    updateMessage,
    setIsMessageUpdating,
  } = useContext(MessagesContext);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (data: Message) => {
      const response = await axios.post("/api/message", {
        messages: [data],
      });
      return response.data;
    },
    async onSuccess(message) {
      const id = nanoid();
      const responseMessage: Message = {
        id,
        text: message,
        isUserMessage: false,
      };
      addMessage(responseMessage);
      setInput("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
      setIsMessageUpdating(false);
    },
    onError(error, variables) {
      console.log("error", error);
      toast.error("Something went wrong. Please try again.");
      removeMessage(variables?.id as string);
      inputRef.current?.focus();
    },
    onMutate(message) {
      addMessage(message);
    },
  });
  useEffect(() => {
    setIsMessageUpdating(isPending);
  }, [isPending, setIsMessageUpdating]);
  function handleOnkeydown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const message: Message = {
        id: nanoid(),
        isUserMessage: true,
        text: input,
      };
      sendMessage(message);
    }
  }

  return (
    <div className={cn("border-t border-zinc-300", className)} {...restProps}>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none">
        <TextAreaAutoSize
          ref={inputRef}
          rows={2}
          maxRows={4}
          onKeyDown={handleOnkeydown}
          autoFocus
          value={input}
          disabled={isPending}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:right-0 text-sm sm:leading-6"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-400">
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CornerDownLeft className="w-4 h-4" />
            )}
          </kbd>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus-visible:border-indigo-600"
        />
      </div>
    </div>
  );
};

export default ChatInput;
