"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster richColors position="top-center" />
        {children}
      </PersistGate>
    </Provider>
  );
}
