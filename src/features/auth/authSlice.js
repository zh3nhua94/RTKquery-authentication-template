import { createSlice } from "@reduxjs/toolkit";

//Auth Slice
const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		token: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { user, token } = action.payload;
			state.user = user;
			state.token = token;
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
		},
	},
});

//Export Actions
export const { setCredentials, logout } = authSlice.actions;

//Export Reducer
export default authSlice.reducer;

//Export Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
