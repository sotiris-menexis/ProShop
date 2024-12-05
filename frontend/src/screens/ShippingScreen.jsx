import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import FormInput from "../components/FormInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";

const ShippingScreen = () => {
	const cart = useSelector(state => state.cart);
	const { shippingAddress } = cart;
	const [address, setAddress] = useState(shippingAddress?.address || "");
	const [city, setCity] = useState(shippingAddress?.city || "");
	const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
	const [country, setCountry] = useState(shippingAddress?.country || "");

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const submitHandler = e => {
		e.preventDefault();
		if (
			address.trim().length !== 0 &&
			city.trim().length !== 0 &&
			postalCode.trim().length !== 0 &&
			country.trim().length !== 0
		) {
			dispatch(saveShippingAddress({ address, city, country, postalCode }));
			navigate("/payment");
		} else {
			toast.error("One or more fields are empty!");
		}
	};

	return (
		<FormContainer>
			<div className="flex lg:flex-col flex-row-reverse h-fit w-3/4 max-w-256">
				<div className="p-4">
					<CheckoutSteps step1 step2 />
				</div>
				<form onSubmit={submitHandler} className="flex flex-col p-2 h-fit flex-1">
					<h2 className="w-full text-left text-xl font-semibold">Shipping Address</h2>
					<div className="my-2">
						<FormInput
							title={"Address"}
							value={address}
							setValue={setAddress}
							placeholder={"Enter your address"}
							type={"text"}
							cName="input input-bordered w-full"
						/>
					</div>
					<div className="my-2">
						<FormInput
							title={"City"}
							value={city}
							setValue={setCity}
							placeholder={"Enter your city"}
							type={"text"}
							cName="input input-bordered w-full"
						/>
					</div>
					<div className="my-2">
						<FormInput
							title={"Country"}
							value={country}
							setValue={setCountry}
							placeholder={"Enter your country"}
							type={"text"}
							cName="input input-bordered w-full"
						/>
					</div>
					<div className="my-2">
						<FormInput
							title={"Postal code"}
							value={postalCode}
							setValue={setPostalCode}
							placeholder={"Enter your postal code"}
							type={"text"}
							cName="input input-bordered w-full"
						/>
					</div>
					<div className="w-full mt-5 flex flex-row justify-end">
						<button className="btn btn-accent lg:w-48">Continue</button>
					</div>
				</form>
			</div>
		</FormContainer>
	);
};

export default ShippingScreen;
