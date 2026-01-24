import { TUser } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type T_AuthState = {
  accessToken: string | null
  user: TUser | null
  id: string | null
}

const initialState: T_AuthState = {
  accessToken: null,
  user: null,
  id: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        accessToken: string
        user: TUser
        id: string
      }>
    ) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.id = action.payload.id
    },

    logout: (state) => {
      state.accessToken = null
      state.user = null
      state.id = null
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
