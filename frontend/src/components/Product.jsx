import React from "react";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
	return (
		<div className="card bg-base-150 w-96 custom-card-shadow">
			<figure>
				<Link to={`/product/${product._id}`}>
					<img className="cursor-pointer" src={product.image} alt={product.name} />
				</Link>
			</figure>
			<div className="card-body">
				<Link to={`/product/${product._id}`} className="card-title text-lg link">
					{product.name && product.name}
				</Link>
				<Rating rating={product.rating} reviews={product.numReviews} />
				<p className="text-lg font-semibold">{product.price}$</p>
			</div>
		</div>
	);
};

export default Product;
