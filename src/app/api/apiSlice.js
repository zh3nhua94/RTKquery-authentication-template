import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "https://localhost:3500",
	credentials: "include", //so that it will send the cookie with every request
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

//if token is expired, refresh it
const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.originalStatus === 403) {
		console.log("sending refresh token");
		//send refresh token to get new access token
		const refreshResult = await baseQuery("/refresh", api, extraOptions);
		console.log("refreshResult", refreshResult);
		if (refreshResult?.data) {
			//by right, user is logged in at this point, so retrieve user info
			const user = api.getState().auth.user;
			//store the new token and user info
			api.dispatch(setCredentials({ ...refreshResult.data, user }));
			//retry original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			//if refresh token fails, log out user
			api.dispatch(logout());
		}
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	//endpoints leave empty because will inject extended api slices
	//eslint-disable-next-line
	endpoints: (builder) => ({}),
});
