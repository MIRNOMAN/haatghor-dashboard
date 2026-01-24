import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from "./features/auth/authSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { baseApi } from "./api";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage: storage,
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Export states and hooks
export const getCurrentState = () => store.getState();
export const persistor = persistStore(store);
