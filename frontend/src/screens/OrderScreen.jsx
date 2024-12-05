import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
	useGetOrderDetailsQuery,
	useGetPayPalClientIdQuery,
	usePayOrderMutation,
	useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const OrderScreen = () => {
	const { id: orderId } = useParams();

	const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

	const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

	const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: loadingPayPal,
		error: errorPayPal,
	} = useGetPayPalClientIdQuery();

	const { userInfo } = useSelector(state => state.auth);

	const onApproveTest = async () => {
		await payOrder({ orderId, details: { payer: {} } });
		refetch();
		toast.success("Payment successful");
	};

	const createOrder = (data, actions) => {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: {
							value: order.totalPrice,
						},
					},
				],
			})
			.then(orderId => {
				return orderId;
			});
	};
	const onApprove = (data, actions) => {
		return actions.order.capture().then(async function (details) {
			try {
				await payOrder({ orderId, details });
				refetch();
				toast.success("Payment successful");
			} catch (err) {
				toast.error(err?.data?.message || err.message);
			}
		});
	};
	const onError = err => {
		toast.error(err.message);
	};

	const deliverOrderHandler = async () => {
		try {
			await deliverOrder(orderId);
			refetch();
			toast.success("Order delivered");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	useEffect(() => {
		if (!errorPayPal && !loadingPayPal && paypal.clientId) {
			const loadPayPaylScript = async () => {
				paypalDispatch({
					type: "resetOptions",
					value: {
						"client-id": paypal.clientId,
						currency: "USD",
					},
				});
				paypalDispatch({ type: "setLoadingStatus", value: "pending" });
			};
			if (order && !order.isPaid) {
				if (!window.paypal) {
					loadPayPaylScript();
				}
			}
		}
	}, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

	return (
		<div>
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
				<div className="flex flex-col">
					<h2 className="text-2xl font-semibold w-full text-left">Order: {order._id}</h2>
					<div className="flex flex-row">
						<div className="w-2/3 flex flex-col divide-y">
							<div className="flex flex-col gap-4 p-4">
								<h2 className="text-xl font-semibold">Shipping</h2>
								<p>
									<strong>Name: </strong>
									{order.user.name}
								</p>
								<p>
									<strong>Email: </strong>
									{order.user.email}
								</p>
								<p>
									<strong>Address: </strong>
									{order.shippingAddress.address}, {order.shippingAddress.city}{" "}
									{order.shippingAddress.postalCode}, {order.shippingAddress.country}
								</p>
								{order.isDelivered ? (
									<div role="alert" className="alert alert-success">
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
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>
											Delivered on {dayjs(order.deliveredAt).format("DD MMM YYYY, HH:mm:ss")}
										</span>
									</div>
								) : (
									<div role="alert" className="alert alert-error">
										<span>Not delivered</span>
									</div>
								)}
							</div>
							<div className="flex flex-col gap-4 p-4">
								<h2 className="text-xl font-semibold">Payment</h2>
								<p>
									<strong>Method: </strong>
									{order.paymentMethod}
								</p>
								{order.isPaid ? (
									<div role="alert" className="alert alert-success">
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
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>Paid on {dayjs(order.paidAt).format("DD MMM YYYY, HH:mm:ss")}</span>
									</div>
								) : (
									<div role="alert" className="alert alert-error">
										<span>Not paid</span>
									</div>
								)}
							</div>
							<div className="flex flex-col gap-4 p-4">
								<h2 className="text-xl font-semibold">Order items</h2>
								{order.orderItems.map(item => (
									<div className="flex flex-row">
										<img className="rounded-md w-24 mr-4" src={item.image} alt={item.name} />
										<Link to={`/products/${item.product}`} className="link link-primary">
											{item.name}
										</Link>
										<p className="ml-24">
											{item.qty}x{item.price}$
										</p>
									</div>
								))}
							</div>
						</div>
						<div className="w-1/3">
							<div className="h-fit p-4 rounded-md shadow-lg">
								<h2 className="text-xl font-semibold pb-4 border-solid border-b">Order Summary</h2>
								<table className="w-full">
									<tbody>
										<tr>
											<td>
												<strong>Items: </strong>
											</td>
											<td>{order.itemsPrice.toFixed(2)}$</td>
										</tr>
										<tr>
											<td>
												<strong>Tax: </strong>
											</td>
											<td>{order.taxPrice.toFixed(2)}$</td>
										</tr>
										<tr>
											<td>
												<strong>Shipping: </strong>
											</td>
											<td>{order.shippingPrice.toFixed(2)}$</td>
										</tr>
										<tr>
											<td>
												<strong>Total: </strong>
											</td>
											<td>{order.totalPrice.toFixed(2)}$</td>
										</tr>
									</tbody>
								</table>
								{!order.isPaid && (
									<div>
										{loadingPay && <span className="loading loading-spinner loading-md"></span>}
										{isPending ? (
											<span className="loading loading-spinner loading-md"></span>
										) : (
											<div>
												{/* <button onClick={onApproveTest} className="mb-5 btn btn-primary">
													Test Pay Order
												</button> */}
												<div>
													<PayPalButtons
														createOrder={createOrder}
														onApprove={onApprove}
														onError={onError}
													/>
												</div>
											</div>
										)}
									</div>
								)}
								{userInfo && userInfo.isAdmin && !order.isDelivered && order.isPaid && (
									<button
										onClick={deliverOrderHandler}
										className="btn btn-accent btn-md w-1/2 mt-4"
										disabled={loadingDeliver}
									>
										{loadingDeliver && <span className="loading loading-spinner"></span>}Mark as
										Delivered
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderScreen;
