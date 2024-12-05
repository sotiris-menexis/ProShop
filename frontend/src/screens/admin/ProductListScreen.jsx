import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
	useGetProductsQuery,
	useCreateProductMutation,
	useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Dialog from "../../components/Dialog";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
	const { pageNumber } = useParams();

	const deleteIdRef = useRef(null);
	const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });

	const [createProduct, { isLoading: loadingCreateProduct }] = useCreateProductMutation();

	const [deleteProduct, { isLoading: loadingDeleteProduct }] = useDeleteProductMutation();

	const createProductHandler = async () => {
		document.getElementById("create_product_dialog").close();
		try {
			await createProduct();
			refetch();
			toast.success("Product created successfully");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	const deleteProductHandler = async () => {
		document.getElementById("delete_product_dialog").close();
		try {
			const res = await deleteProduct(deleteIdRef.current).unwrap();
			refetch();
			toast.success(res.message);
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	return (
		<div className="flex flex-col mt-10">
			<Dialog
				dialogId={"create_product_dialog"}
				title="Create Product"
				description="Are you sure you want to create a product ?"
				yesButtonText="Yes"
				noButtonText="No"
				confirmHandler={createProductHandler}
			/>
			<Dialog
				dialogId={"delete_product_dialog"}
				title="Delete Product"
				description="Are you sure you want to delete this product ?"
				yesButtonText="Yes"
				noButtonText="No"
				confirmHandler={deleteProductHandler}
			/>
			<div className="flex flex-row justify-between items-center mb-4">
				<h1 className="text-2xl font-semibold">Products</h1>
				<button
					onClick={() => document.getElementById("create_product_dialog").showModal()}
					className="btn btn-accent btn-sm"
				>
					<MdEdit /> Create product
				</button>
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
					<table className="table table-zebra">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{data?.products &&
								data.products.map(product => (
									<tr key={product._id}>
										<td>{product._id}</td>
										<td>{product.name}</td>
										<td>{product.price}$</td>
										<td>{product.category}</td>
										<td>{product.brand}</td>
										<td>
											<div className="flex flex-row">
												<Link
													className="btn btn-ghost btn-xs"
													to={`/admin/product/${product._id}/edit`}
												>
													<FaEdit />
												</Link>
												<button
													onClick={() => {
														deleteIdRef.current = product._id;
														document.getElementById("delete_product_dialog").showModal();
													}}
													className="btn btn-error btn-xs ml-2 text-base-100"
												>
													<FaTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
					{data?.pages > 1 && (
						<Paginate total={data.pages} current={pageNumber ? pageNumber : 1} isAdmin={true} />
					)}
				</>
			)}
		</div>
	);
};

export default ProductListScreen;
