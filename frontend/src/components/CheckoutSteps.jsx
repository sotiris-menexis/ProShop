import React from "react";
import { useNavigate } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
	const navigate = useNavigate();

	return (
		<ul className="steps steps-vertical lg:steps-horizontal w-full h-full">
			<li className={`step${step1 ? " step-primary" : ""}`}>
				<button className="link link-primary" onClick={() => navigate("/login")} disabled={!step1}>
					Log in
				</button>
			</li>
			<li className={`step${step2 ? " step-primary" : ""}`}>
				<button
					className="link link-primary"
					onClick={() => navigate("/shipping")}
					disabled={!step2}
				>
					Shipping
				</button>
			</li>
			<li className={`step${step3 ? " step-primary" : ""}`}>
				<button
					className="link link-primary"
					onClick={() => navigate("/payment")}
					disabled={!step3}
				>
					Payment
				</button>
			</li>
			<li className={`step${step4 ? " step-primary" : ""}`}>
				<button
					className="link link-primary"
					onClick={() => navigate("/placeorder")}
					disabled={!step4}
				>
					Place order
				</button>
			</li>
		</ul>
	);
};

export default CheckoutSteps;
