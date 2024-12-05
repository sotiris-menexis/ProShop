import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import FormInput from "../../components/FormInput";
import { useUpdateUserMutation, useGetUserDetailsQuery } from "../../slices/usersApiSlice";
import { FaArrowLeft } from "react-icons/fa";

const UserEditScreen = () => {
	const { id: userId } = useParams();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);

	const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

	const navigate = useNavigate();

	const updateUserHandler = async e => {
		e.preventDefault();
		try {
			const res = await updateUser({
				userId,
				name,
				email,
				isAdmin,
			});
			if (res.error) {
				toast.error(error?.data?.message || error.error);
			} else {
				toast.success("User updated successfully");
				navigate("/admin/userlist");
			}
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setIsAdmin(Boolean(user.isAdmin));
		}
	}, [user]);

	return (
		<div className="flex flex-row flex-wrap">
			<div className="w-full mb-10 pl-4">
				<Link to="/admin/userlist" className="btn btn-ghost">
					<FaArrowLeft />
					Go back
				</Link>
			</div>
			<FormContainer>
				<div className="flex flex-col gap-6 rounded-md shadow-lg p-4 md:min-w-128">
					<h1 className="text-2xl font-semibold">Edit User</h1>
					{loadingUpdate && (
						<div className="flex flex-row justify-center">
							<span className="loading loading-dots loading-lg"></span>
						</div>
					)}
					{error && (
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
					)}
					{!loadingUpdate && !error && user && (
						<form className="flex flex-col gap-4">
							<FormInput
								title="Name"
								value={name}
								setValue={setName}
								placeholder="Enter user name"
								type="text"
							></FormInput>
							<FormInput
								title="Email"
								value={email}
								setValue={setEmail}
								placeholder="Enter user email"
								type="email"
							></FormInput>
							<div className="form-control w-28">
								<label className="label cursor-pointer">
									<span className="label-text">Admin</span>
									<input
										type="checkbox"
										className="toggle"
										checked={isAdmin}
										onChange={e => setIsAdmin(e.target.checked)}
									/>
								</label>
							</div>

							<button className="btn btn-accent w-full" onClick={updateUserHandler}>
								Update
							</button>
						</form>
					)}
				</div>
			</FormContainer>
		</div>
	);
};

export default UserEditScreen;
