import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import FormInput from "../components/FormInput";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { register as registerLocal } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/usersApiSlice";

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const [register, { isLoading }] = useRegisterMutation();
	const dispatch = useDispatch();

	const navigate = useNavigate();
	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get("redirect") || "/";

	const submitHandler = async e => {
		e.preventDefault();
		console.log(e);
		if (password === repeatPassword) {
			try {
				const res = await register({ name, email, password }).unwrap();
				dispatch(registerLocal({ ...res }));
				navigate(redirect);
			} catch (error) {
				toast.error(error?.data?.message || error.error);
			}
		} else {
			toast.error("Passwords must match!");
		}
	};

	return (
		<FormContainer>
			<form onSubmit={submitHandler} className="rounded-md shadow-lg flex flex-col p-16 h-fit">
				<h2 className="w-full text-center text-xl font-semibold">Register</h2>
				<div className="my-2">
					<FormInput
						title={"Name"}
						value={name}
						setValue={setName}
						type={"text"}
						placeholder={"Insert name"}
						cName="input input-bordered w-full"
					/>
				</div>
				<div className="my-2">
					<FormInput
						title={"Email"}
						value={email}
						setValue={setEmail}
						type={"email"}
						placeholder={"Insert email"}
						cName="input input-bordered w-full"
					/>
				</div>
				<div className="my-2">
					<FormInput
						title={"Password"}
						value={password}
						setValue={setPassword}
						type={"password"}
						placeholder={"Insert password"}
						cName="input input-bordered w-full"
					/>
				</div>
				<div className="my-2">
					<FormInput
						title={"Repeat Password"}
						value={repeatPassword}
						setValue={setRepeatPassword}
						type={"password"}
						placeholder={"Repeat password"}
						cName="input input-bordered w-full"
					/>
				</div>
				<button type="submit" className="btn btn-width btn-accent my-5" /* disabled={isLoading} */>
					{/* {isLoading && <span className="loading loading-spinner"></span>} */}Sign up
				</button>
				<div className="w-full text-center flex flex-row gap-1">
					<p>Already have and account? Log in</p>
					<Link
						to={`/login${redirect ? `?redirect=${redirect}` : ""}`}
						className="link link-primary"
					>
						here
					</Link>
				</div>
			</form>
		</FormContainer>
	);
};

export default RegisterScreen;
