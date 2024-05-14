"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC, ReactNode } from "react";
import { MessagesProvider } from "./messages";

type QueryProviderProps = {
  children: ReactNode;
};
const queryClient = new QueryClient();
const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MessagesProvider>{children}</MessagesProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
