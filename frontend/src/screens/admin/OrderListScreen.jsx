import React from "react";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { FaTimes } from "react-icons/fa";
import dayjs from "./../../../node_modules/dayjs/esm/index";

const OrderListScreen = () => {
	const { data: orders, isLoading, error } = useGetOrdersQuery();

	return (
		<div className="flex flex-col mt-10">
			<h1 className="text-2xl font-semibold">Orders</h1>
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
							<th>USER</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders &&
							orders.map(order => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.user && order.user.name}</td>
									<td>{dayjs(order.createdAt).format("DD MMM YYYY, HH:mm:ss")}</td>
									<td>{order.totalPrice}$</td>
									<td>
										{order.isPaid ? (
											dayjs(order.paidAt).format("DD MMM YYYY, HH:mm:ss")
										) : (
											<FaTimes className="text-error" />
										)}
									</td>
									<td>
										{order.isDelivered ? (
											dayjs(order.deliveredAt).format("DD MMM YYYY, HH:mm:ss")
										) : (
											<FaTimes className="text-error" />
										)}
									</td>
									<td>
										<Link className="btn btn-accent btn-sm" to={`/order/${order._id}`}>
											View order
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default OrderListScreen;
