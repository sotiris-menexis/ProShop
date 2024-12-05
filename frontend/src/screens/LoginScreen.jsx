import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [login, { isLoading }] = useLoginMutation();

	const { userInfo } = useSelector(state => state.auth);

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get("redirect") || "/";

	const submitHandler = async e => {
		e.preventDefault();
		try {
			const res = await login({ email, password }).unwrap();
			dispatch(setCredentials({ ...res }));
			navigate(redirect);
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, redirect, navigate]);

	return (
		<FormContainer>
			<form onSubmit={submitHandler} className="rounded-md shadow-lg flex flex-col p-16 h-fit">
				<h2 className="w-full text-center text-xl font-semibold">Log in</h2>
				<div className="my-2">
					<label className="form-control w-full">
						<div className="label">
							<span className="label-text">Email</span>
						</div>
						<input
							value={email}
							onChange={e => setEmail(e.target.value)}
							type="text"
							placeholder="Insert email"
							className="input input-bordered w-full max-w-xs"
						/>
					</label>
				</div>
				<div className="my-2">
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Password</span>
						</div>
						<input
							value={password}
							onChange={e => setPassword(e.target.value)}
							type="password"
							placeholder="Insert password"
							className="input input-bordered w-full max-w-xs"
						/>
					</label>
				</div>
				<button type="submit" className="btn btn-width btn-accent my-5" disabled={isLoading}>
					{isLoading && <span className="loading loading-spinner"></span>}Log in
				</button>
				<div className="w-full text-center flex flex-row gap-1">
					<p>No account? Register</p>
					<Link
						to={`/register${redirect ? `?redirect=${redirect}` : ""}`}
						className="link link-primary"
					>
						here
					</Link>
				</div>
			</form>
		</FormContainer>
	);
};

export default LoginScreen;
