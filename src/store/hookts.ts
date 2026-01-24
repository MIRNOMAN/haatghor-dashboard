import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { store } from "./store";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useCurrentToken = (state: RootState) => state?.auth?.accessToken;
export const useCurrentUser = (state: RootState) => state?.auth?.user;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
