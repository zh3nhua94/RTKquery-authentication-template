import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		//login endpoint
		login: builder.mutation({
			//pass credentials to query
			query: (credentials) => ({
				url: "/auth",
				method: "POST",
				body: { ...credentials },
			}),
		}),
	}),
});

//export built-in hooks
export const { useLoginMutation } = authApiSlice;
