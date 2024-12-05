import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import CartListItem from "../components/CartListItem";

const CartScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const cart = useSelector(state => state.cart);
	const { cartItems } = cart;

	const handleOnCheckout = () => {
		navigate("/login?redirect=/shipping");
	};

	return (
		<div className="flex flex-row mt-10">
			<div className="flex flex-row flex-wrap w-3/4 pr-2">
				<h2 className="text-2xl w-full font-semibold">Shopping cart</h2>
				{cartItems.length > 0 ? (
					<>
						<div className="w-full mt-3">
							<h2 className="text-xl font-semibold">Items</h2>
						</div>
						<div className="flex flex-col w-full mt-3">
							{cartItems.map(cItem => (
								<CartListItem key={cItem._id} cartItem={cItem} />
							))}
						</div>
					</>
				) : (
					<div className="mt-3">
						<div role="alert" className="alert alert-info">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="h-6 w-6 shrink-0 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span>
								Shopping cart is empty!{" "}
								<Link to="/" className="link">
									Go back
								</Link>
							</span>
						</div>
					</div>
				)}
			</div>
			{cartItems.length > 0 && (
				<div className="w-1/4 pl-2">
					<div className="flex flex-col shadow-md divide-y rounded-md">
						<div className="p-2">
							<h2 className="text-xl font-semibold">
								Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
							</h2>
						</div>
						<div className="p-2">
							<p className="text-lg">
								{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}$
							</p>
						</div>
						<div className="p-2 w-full flex flex-row justify-center">
							<button className="btn btn-accent w-full" onClick={handleOnCheckout}>
								Proceed to checkout
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CartScreen;
