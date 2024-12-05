import React from "react";
import { Link, useParams } from "react-router-dom";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { FaArrowLeft } from "react-icons/fa";

const HomeScreen = () => {
	const { pageNumber, keyword } = useParams();

	const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword });

	return (
		<div>
			<div className="w-full mb-10 pl-4">
				{keyword && (
					<Link to="/" className="btn btn-ghost">
						<FaArrowLeft />
						Go back
					</Link>
				)}
			</div>
			{!keyword && (
				<div className="w-full my-5">
					<ProductCarousel />
				</div>
			)}
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
				<div className="flex flex-row flex-wrap">
					<h2 className="w-full text-2xl font-semibold my-5">Latest Products</h2>
					{data.products.map(product => (
						<div key={product._id} className="lg:w-1/3 md:w-1/2 w-full p-2">
							<Product product={product} />
						</div>
					))}
				</div>
			)}
			{data?.pages > 1 && (
				<Paginate current={pageNumber ? pageNumber : 1} total={data.pages} keyword={keyword} />
			)}
		</div>
	);
};

export default HomeScreen;
