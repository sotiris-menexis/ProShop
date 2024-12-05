import React from "react";
import { FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import QtySelector from "./QtySelector";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartListItem = ({ cartItem }) => {
	const dispatch = useDispatch();
	console.log(cartItem);

	const handleQtyChange = async type => {
		if (type === "add") {
			if (cartItem.countInStock > cartItem.qty) {
				dispatch(addToCart({ ...cartItem, qty: cartItem.qty + 1 }));
			}
		} else {
			if (cartItem.qty > 1) {
				dispatch(addToCart({ ...cartItem, qty: cartItem.qty - 1 }));
			}
		}
	};
	const handleRemoveItem = () => {
		dispatch(removeFromCart(cartItem._id));
	};

	return (
		<div className="flex flex-row items-center p-4 rounded-md shadow-md my-4 w-full">
			<div>
				<img className="rounded-md w-24" src={cartItem.image} alt={cartItem.name} />
			</div>
			<div className="ml-2">
				<Link className="link text-lg" to={`/product/${cartItem._id}`}>
					{cartItem.name}
				</Link>
			</div>
			<div className="ml-auto">
				<p className="text-lg">{cartItem.price}$</p>
			</div>
			<div className="ml-4">
				<QtySelector
					qty={cartItem.qty}
					countInStock={cartItem.countInStock}
					onQtyChange={handleQtyChange}
				/>
			</div>
			<div className="ml-4">
				<div className="tooltip" data-tip="Delete">
					<button className="btn btn-error btn-outline btn-sm" onClick={handleRemoveItem}>
						<FaTrashCan />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartListItem;
