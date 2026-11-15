"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { App } from "antd";
import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const isHydrated = useSyncExternalStore(
      emptySubscribe,
      getClientSnapshot,
      getServerSnapshot,
  );

  return (
    <QueryClientProvider client={queryClient}>
        {isHydrated ? <App>{children}</App> : children}
    </QueryClientProvider>
  );
}
