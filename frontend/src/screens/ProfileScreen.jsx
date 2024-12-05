import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { setCredentials } from "../slices/authSlice";
import FormInput from "../components/FormInput";
import dayjs from "./../../node_modules/dayjs/esm/index";

const ProfileScreen = () => {
	const { userInfo } = useSelector(state => state.auth);

	const [name, setName] = useState(userInfo?.name || "");
	const [email, setEmail] = useState(userInfo?.email || "");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const dispatch = useDispatch();

	const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

	const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();
	console.log(orders);
	const submitHandler = async e => {
		e.preventDefault();
		if (password.trim() === repeatPassword.trim()) {
			try {
				const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
				dispatch(setCredentials(res));
				toast.success("Profile updated successfully");
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		} else {
			toast.error("Password must match");
		}
	};

	return (
		<div className="flex flex-col mt-10">
			<div>
				<h1 className="text-2xl font-semibold">User Profile</h1>
			</div>
			<div className="flex flex-row flex-wrap">
				<div className="md:w-1/4 w-full">
					<form className="flex flex-col gap-4 p-4" onSubmit={submitHandler}>
						<FormInput
							type={"text"}
							value={name}
							setValue={setName}
							title={"Name"}
							placeholder={"Enter your name"}
							cName="input input-bordered w-full"
						/>
						<FormInput
							type={"email"}
							value={email}
							setValue={setEmail}
							title={"Email"}
							placeholder={"Enter your email"}
							cName="input input-bordered w-full"
						/>
						<FormInput
							type={"password"}
							value={password}
							setValue={setPassword}
							title={"Password"}
							placeholder={"Enter your password"}
							cName="input input-bordered w-full"
						/>
						<FormInput
							type={"password"}
							value={repeatPassword}
							setValue={setRepeatPassword}
							title={"Repeat Password"}
							placeholder={"Repeat your password"}
							cName="input input-bordered w-full"
						/>
						<button
							type="submit"
							className="btn btn-accent max-w-48"
							disabled={loadingUpdateProfile}
						>
							{loadingUpdateProfile && <span className="loading loading-spinner"></span>}Update
						</button>
					</form>
				</div>
				<div className="md:w-3/4 w-full">
					<div className="rounded-md p-2 shadow-md overflow-x-auto">
						<h2 className="text-2xl font-semibold">Orders</h2>
						<table className="table table-zebra lg:table-md table-xs">
							<thead>
								<tr>
									<th>#</th>
									<th>Delivered At</th>
									<th>Paid At</th>
									<th>Payment Method</th>
									<th>Shipping Address</th>
									<th>Total items</th>
									<th>Total Price</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{loadingOrders && <progress className="progress w-56"></progress>}
								{errorOrders && (
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
										<span>{errorOrders?.data?.message || errorOrders.error}</span>
									</div>
								)}
								{orders &&
									orders.map((order, index) => (
										<tr key={order._id}>
											<td>{index + 1}</td>
											<td>
												{order.isDelivered
													? dayjs(order.deliveredAt).format("DD MMM YYYY, HH:mm:ss")
													: "-"}
											</td>
											<td>
												{order.isPaid ? dayjs(order.paidAt).format("DD MMM YYYY, HH:mm:ss") : "-"}
											</td>
											<td>{order.paymentMethod}</td>
											<td>
												{order.shippingAddress.address}, {order.shippingAddress.city}{" "}
												{order.shippingAddress.postalCode}, {order.shippingAddress.country}
											</td>
											<td>{order.orderItems.reduce((acc, item) => acc + item.qty, 0)}</td>
											<td>{order.totalPrice}$</td>
											<td>
												<Link className="btn btn-accent btn-sm" to={`/order/${order._id}`}>
													View order
												</Link>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileScreen;
