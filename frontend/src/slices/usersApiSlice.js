import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/auth`,
				method: "POST",
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/logout`,
				method: "POST",
			}),
		}),
		register: builder.mutation({
			query: data => ({
				url: USERS_URL,
				method: "POST",
				body: data,
			}),
		}),
		profile: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/profile`,
				method: "PUT",
				body: data,
			}),
		}),
		getUsers: builder.query({
			query: () => ({
				url: USERS_URL,
			}),
			keepUnusedDataFor: 5,
			providesTags: ["Users"],
		}),
		deleteUser: builder.mutation({
			query: userId => ({
				url: `${USERS_URL}/${userId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Users"],
		}),
		getUserDetails: builder.query({
			query: userId => ({
				url: `${USERS_URL}/${userId}`,
			}),
			providesTags: ["User"],
			keepUnusedDataFor: 5,
		}),
		updateUser: builder.mutation({
			query: data => ({
				url: `${USERS_URL}/${data.userId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["User", "Users"],
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useProfileMutation,
	useGetUsersQuery,
	useDeleteUserMutation,
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} = usersApiSlice;
