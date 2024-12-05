import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import { FaArrowLeft } from "react-icons/fa";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import QtySelector from "../components/QtySelector";
import { addToCart } from "../slices/cartSlice";
import dayjs from "./../../node_modules/dayjs/esm/index";
import Meta from "../components/Meta";

const ProductDetailsScreen = () => {
	const { id: productId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [qty, setQty] = useState(1);
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState(0);

	const { userInfo } = useSelector(state => state.auth);

	const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

	const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, qty }));
		navigate("/cart");
	};

	const handleQtyChange = type => {
		if (type === "add") {
			setQty(prevQty => (prevQty < product.countInStock ? prevQty + 1 : prevQty));
		} else {
			setQty(prevQty => (prevQty > 1 ? prevQty - 1 : 1));
		}
	};

	const createReviewHandler = async e => {
		e.preventDefault();
		console.log({ productId, rating, comment });
		try {
			await createReview({ productId, rating, comment }).unwrap();
			toast.success("Review Submitted");
			setRating(0);
			setComment("");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	return (
		<div className="flex flex-wrap mt-10">
			<Meta title={product?.name} />
			<div className="w-full mb-10 pl-4">
				{" "}
				<Link to="/" className="btn btn-ghost">
					<FaArrowLeft />
					Go back
				</Link>
			</div>
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
				<>
					{product && (
						<>
							<div className="lg:w-1/3 md:w-1/3 w-full p-4">
								{product.image && (
									<img
										className="max-h-96 rounded-lg shadow-md"
										src={product.image}
										alt={product.name}
									/>
								)}
							</div>
							<div className="lg:w-1/3 md:w-1/3 w-full p-4">
								<div className="flex flex-col gap-4 divide-y">
									<h2 className="text-lg font-semibold">{product.name}</h2>
									{product && (
										<Rating
											rating={product.rating ? product.rating : 0}
											reviews={product.numReviews ? product.numReviews : null}
										/>
									)}
									<p>{product.description && product.description}</p>
								</div>
							</div>
							<div className="lg:w-1/3 md:w-1/3 w-full p-4">
								<div className="flex flex-col gap-4 divide-y w-fit shadow-md p-2 rounded-md">
									<p>
										Price: <strong>{product.price && product.price}$</strong>
									</p>
									{product.countInStock !== null && (
										<p>
											Status:{" "}
											<strong>{product.countInStock > 0 ? "In stock" : "Out of stock"}</strong>
										</p>
									)}
									<div className="p-2 flex flex-col">
										{product.countInStock > 0 && (
											<QtySelector
												qty={qty}
												onQtyChange={handleQtyChange}
												countInStock={product.countInStock}
											/>
										)}
										<button
											className={`btn btn-accent btn-md mt-3${
												product.countInStock === 0 ? " btn-disabled" : ""
											}`}
											onClick={addToCartHandler}
										>
											Add to cart
										</button>
									</div>
								</div>
							</div>
							<div className="w-full p-4">
								<div className="flex flex-col">
									{product && product.reviews.length > 0 ? (
										product.reviews.map(review => (
											<div
												className="flex flex-col max-w-96 shadow-sm rounded-md p-4"
												key={review._id}
											>
												<strong>{review.name}</strong>{" "}
												<div className="flex flex-row justify-between">
													<Rating rating={product.rating ? product.rating : 0} />
													<p className="text-sm">{dayjs(review.createdAt).format("DD-MMM-YYYY")}</p>
												</div>
												<p className="mt-2">{review.comment}</p>
											</div>
										))
									) : (
										<div role="alert" className="alert alert-info my-6 w-full max-w-96">
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
											<span>No reviews</span>
										</div>
									)}
								</div>
								{userInfo ? (
									<form className="mt-5" onSubmit={createReviewHandler}>
										<h2 className="text-xl font-semibold p-4 bg-secondary max-w-96 rounded-md mb-5">
											Write a Customer Review
										</h2>
										<div className="flex flex-col gap-4">
											<label className="form-control w-36">
												<div className="label">
													<span className="label-text">Rating</span>
												</div>
												<select
													defaultValue={"Select..."}
													onChange={e => {
														setRating(Number(e.target.value.slice(0, 1)));
													}}
													className="select select-bordered select-sm"
												>
													<option disabled>Select...</option>
													<option>1 - Poor</option>
													<option>2 - Fair</option>
													<option>3 - Good</option>
													<option>4 - Very Good</option>
													<option>5 - Excellent</option>
												</select>
											</label>
											<label className="form-control">
												<div className="label">
													<span className="label-text">Comment</span>
												</div>
												<textarea
													value={comment}
													onChange={e => setComment(e.target.value)}
													className="textarea textarea-bordered h-24 w-full max-w-96"
													placeholder="Enter your review comment"
												></textarea>
											</label>
										</div>
										<button
											type="submit"
											className="btn btn-accent mt-5"
											disabled={loadingProductReview}
										>
											{loadingProductReview && (
												<span className="loading loading-spinner loading-md"></span>
											)}
											Submit review
										</button>
									</form>
								) : (
									<>
										<h2 className="text-xl font-semibold p-4 bg-slate-100 max-w-96 rounded-md mb-5">
											Write a Customer Review
										</h2>
										<div role="alert" className="alert alert-info max-w-96">
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
												Please{" "}
												<Link className="link link-neutral" to="/login">
													sign in{" "}
												</Link>
												to write a review
											</span>
										</div>
									</>
								)}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ProductDetailsScreen;
