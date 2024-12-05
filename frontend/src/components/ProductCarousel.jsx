import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
	const { data: products, isLoading, error } = useGetTopProductsQuery();

	return (
		<>
			{isLoading ? (
				<span className="loading loading-dots loading-md"></span>
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
				<div className="slider-container">
					<h2 className="text-2xl font-semibold mb-5">Top Rated Products</h2>
					<Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
						{products.map(product => (
							<div key={product._id}>
								<div className="flex flex-col items-center">
									<img className="rounded-lg shadow-md" src={product.image} alt={product.name} />
									<Link to={`/product/${product._id}`} className="link link-primary">
										{product.name}
									</Link>
								</div>
							</div>
						))}
					</Slider>
				</div>
			)}
		</>
	);
};

export default ProductCarousel;
