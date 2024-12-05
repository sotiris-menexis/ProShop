import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import FormInput from "../../components/FormInput";
import {
	useUpdateProductMutation,
	useGetProductDetailsQuery,
	useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import { FaArrowLeft } from "react-icons/fa";

const ProductEditScreen = () => {
	const { id: productId } = useParams();
	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState("");
	const [brand, setBrand] = useState("");
	const [category, setCategory] = useState("");
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState("");

	const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

	const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

	const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

	const navigate = useNavigate();

	const uploadFileHandler = async e => {
		const formData = new FormData();
		formData.append("image", e.target.files[0]);
		try {
			const res = await uploadProductImage(formData).unwrap();
			toast.success(res.message);
			setImage(res.image);
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	const updateProductHandler = async e => {
		e.preventDefault();
		try {
			const res = await updateProduct({
				productId,
				name,
				price,
				image,
				brand,
				category,
				countInStock,
				description,
			});
			if (res.error) {
				toast.error(error?.data?.message || error.error);
			} else {
				toast.success("Product updated successfully");
				navigate("/admin/productlist");
			}
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};

	useEffect(() => {
		if (product) {
			setName(product.name);
			setPrice(product.price);
			setImage(product.image);
			setBrand(product.brand);
			setCategory(product.category);
			setCountInStock(product.countInStock);
			setDescription(product.description);
		}
	}, [product]);

	return (
		<div className="flex flex-row flex-wrap">
			<div className="w-full mb-10 pl-4">
				<Link to="/admin/productlist" className="btn btn-ghost">
					<FaArrowLeft />
					Go back
				</Link>
			</div>
			<FormContainer>
				<div className="flex flex-col gap-6 rounded-md shadow-lg p-4 md:min-w-128">
					<h1 className="text-2xl font-semibold">Edit Product</h1>
					{loadingUpdate && (
						<div className="flex flex-row justify-center">
							<span className="loading loading-dots loading-lg"></span>
						</div>
					)}
					{error && (
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
					)}
					{!loadingUpdate && !error && product && (
						<form className="flex flex-col gap-4">
							<FormInput
								title="Name"
								value={name}
								setValue={setName}
								placeholder="Enter product name"
								type="text"
							></FormInput>
							<FormInput
								title="Price"
								value={price}
								setValue={setPrice}
								placeholder="Enter product price"
								type="number"
							></FormInput>
							<div>
								<FormInput
									title="Image"
									value={image}
									setValue={setImage}
									placeholder="Image url"
									type="text"
								></FormInput>
								<input
									onChange={uploadFileHandler}
									type="file"
									className="file-input file-input-bordered file-input-accent w-full"
								/>
							</div>
							<FormInput
								title="Brand"
								value={brand}
								setValue={setBrand}
								placeholder="Enter product brand"
								type="text"
							></FormInput>
							<FormInput
								title="Category"
								value={category}
								setValue={setCategory}
								placeholder="Enter product category"
								type="text"
							></FormInput>
							<FormInput
								title="Count in stock"
								value={countInStock}
								setValue={setCountInStock}
								placeholder="Enter product count in stock"
								type="number"
							></FormInput>
							<label className="form-control">
								<div className="label">
									<span className="label-text">Description</span>
								</div>
								<textarea
									value={description}
									onChange={e => setDescription(e.target.value)}
									placeholder="Enter product description"
									className="textarea textarea-bordered w-full"
								></textarea>
							</label>

							<button className="btn btn-accent w-full" onClick={updateProductHandler}>
								Update
							</button>
						</form>
					)}
				</div>
			</FormContainer>
		</div>
	);
};

export default ProductEditScreen;
