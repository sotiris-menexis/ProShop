import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
	const cart = useSelector(state => state.cart);
	const { shippingAddress, paymentMethod: pMethod } = cart;
	const [paymentMethod, setPaymentMethod] = useState(pMethod || "PayPal");

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const submitHandler = e => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		navigate("/placeorder");
	};

	useEffect(() => {
		if (!shippingAddress) {
			navigate("/shipping");
		}
	}, [shippingAddress, navigate]);

	return (
		<FormContainer>
			<div className="flex lg:flex-col flex-row-reverse h-fit w-3/4 max-w-256">
				<div className="p-4">
					<CheckoutSteps step1 step2 step3 />
				</div>
				<form onSubmit={submitHandler} className="flex flex-col p-2 h-fit flex-1">
					<h2 className="w-full text-left text-xl font-semibold">Payment method</h2>
					<div className="py-2">
						<select
							onChange={e => setPaymentMethod(e.target.value)}
							className="select select-bordered w-full max-w-xs"
						>
							<option value={"PayPal"} selected>
								PayPal
							</option>
						</select>
					</div>
					<div className="w-full mt-5 flex flex-row justify-end">
						<button className="btn btn-accent lg:w-48">Continue</button>
					</div>
				</form>
			</div>
		</FormContainer>
	);
};

export default PaymentScreen;
