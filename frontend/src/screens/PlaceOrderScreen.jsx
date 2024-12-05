import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
	const cart = useSelector(state => state.cart);
	const {
		shippingAddress,
		paymentMethod,
		cartItems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	} = cart;

	const dispatch = useDispatch();
	const [createOrder, { isLoading, error }] = useCreateOrderMutation();

	const navigate = useNavigate();

	const placeOrderHandler = async () => {
		try {
			const res = await createOrder({
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
			}).unwrap();
			dispatch(clearCartItems());
			navigate(`/order/${res._id}`);
		} catch (error) {
			toast.error(error);
		}
	};

	useEffect(() => {
		if (!shippingAddress) {
			navigate("/shipping");
		} else if (!paymentMethod) {
			navigate("/payment");
		}
	}, [shippingAddress, paymentMethod, navigate]);

	return (
		<FormContainer>
			<div className="flex lg:flex-col flex-row-reverse h-fit w-3/4 max-w-256">
				<div className="p-4">
					<CheckoutSteps step1 step2 step3 step4 />
				</div>
				<div className="flex flex-row w-full">
					<div className="w-2/3 pr-4">
						<div className="flex flex-col gap-4 divide-y">
							<div className="flex flex-col">
								<h2 className="text-2xl font-semibold my-2">Shipping</h2>
								<p>
									<strong className="mr-2">Address:</strong>
									{shippingAddress?.address}, {shippingAddress?.city} {shippingAddress?.postalCode},{" "}
									{shippingAddress?.country}
								</p>
							</div>
							<div className="flex flex-col">
								<h2 className="text-2xl font-semibold my-2">Payment Method</h2>
								<p>
									<strong className="mr-2">Method:</strong>
									{paymentMethod && paymentMethod}
								</p>
							</div>
							<div className="flex flex-col">
								<h2 className="text-2xl font-semibold my-2">Order Items</h2>
								<div className="flex flex-col divide-y">
									{cartItems &&
										cartItems.map(item => (
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
						</div>
					</div>
					<div className="w-1/3 pl-4">
						<div className="flex flex-col divide-y shadow-lg rounded-md w-fit p-4">
							<h2 className="text-2xl font-semibold p-2">Order Summary</h2>
							<div className="p-2 flex flex-row justify-between">
								<p>
									<strong>Items:</strong>
								</p>
								<p>{itemsPrice && itemsPrice}$</p>
							</div>
							<div className="p-2 flex flex-row justify-between">
								<p>
									<strong>Tax:</strong>
								</p>
								<p>{taxPrice && taxPrice}$</p>
							</div>
							<div className="p-2 flex flex-row justify-between">
								<p>
									<strong>Shipping:</strong>
								</p>
								<p>{shippingPrice && shippingPrice}$</p>
							</div>
							<div className="p-2 flex flex-row justify-between">
								<p>
									<strong>Total:</strong>
								</p>
								<p>{totalPrice && totalPrice}$</p>
							</div>
							<div className="p-2">
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
										<span>{error}</span>
									</div>
								)}
							</div>
							<button
								onClick={placeOrderHandler}
								className="btn btn-accent w-full my-4"
								disabled={isLoading}
							>
								{isLoading && <span className="loading loading-spinner"></span>}Place order
							</button>
						</div>
					</div>
				</div>
			</div>
		</FormContainer>
	);
};

export default PlaceOrderScreen;
