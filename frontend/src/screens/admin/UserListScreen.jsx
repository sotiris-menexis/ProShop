import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import dayjs from "./../../../node_modules/dayjs/esm/index";
import Dialog from "../../components/Dialog";
import { toast } from "react-toastify";

const UserListScreen = () => {
	const deleteIdRef = useRef(null);

	const { data: users, isLoading, error } = useGetUsersQuery();

	const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

	const deleteHandler = async () => {
		document.getElementById("delete_user_dialog").close();
		console.log(deleteIdRef.current);
		try {
			await deleteUser(deleteIdRef.current);
			toast.success("User deleted successfully");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	return (
		<div className="flex flex-col mt-10">
			<Dialog
				dialogId="delete_user_dialog"
				title="Delete User"
				description="Are you sure you want to delete this User ?"
				yesButtonText="Yes"
				noButtonText="No"
				confirmHandler={deleteHandler}
			/>
			<h1 className="text-2xl font-semibold">Users</h1>
			{isLoading ? (
				<div className="h-48 w-full flex flex-row items-center justify-center">
					<span className="loading loading-dots loading-lg"></span>
				</div>
			) : error ? (
				<div role="alert" className="alert alert-error">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{error?.data?.message || error.error}</span>
				</div>
			) : (
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th>CREATED AT</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users &&
							users.map(user => (
								<tr key={user._id}>
									<td>{user._id}</td>
									<td>{user.name}</td>
									<td>
										<a className="link link-primary" href={`mailto:${user.email}`}>
											{user.email}
										</a>
									</td>
									<td>
										{user.isAdmin ? (
											<FaCheck className="text-success" />
										) : (
											<FaTimes className="text-error" />
										)}
									</td>
									<td>{dayjs(user.createAt).format("DD MMM YYYY, HH:mm")}</td>
									<td>
										<div className="flex flex-row">
											<Link className="btn btn-ghost btn-xs" to={`/admin/user/${user._id}/edit`}>
												<FaEdit />
											</Link>
											<button
												onClick={() => {
													deleteIdRef.current = user._id;
													document.getElementById("delete_user_dialog").showModal();
												}}
												className="btn btn-error btn-xs ml-2 text-base-100"
												disabled={user.isAdmin}
											>
												<FaTrash />
											</button>
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default UserListScreen;
