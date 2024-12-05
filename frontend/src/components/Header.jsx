import React from "react";
import ThemeController from "./ThemeController";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutLocal } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";

const Header = ({ setTheme }) => {
	const navigate = useNavigate();
	const { cartItems } = useSelector(state => state.cart);
	const { userInfo } = useSelector(state => state.auth);
	const [logout, { isLoading }] = useLogoutMutation();
	const dispatch = useDispatch();

	const logoutHandler = async () => {
		try {
			await logout().unwrap();
			dispatch(logoutLocal());
			navigate("/login");
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};

	return (
		<header className="bg-secondary flex flex-row px-4 py-6 justify-center">
			<div className="flex flex-row max-w-screen-xl w-full justify-between items-center">
				<Link to="/" className="text-3xl font-bold text-base-100">
					ProShop
				</Link>
				<div className="flex flex-row action-btns items-center">
					<SearchBox />
					<div className="mx-2 relative">
						<button className="btn btn-ghost btn-sm" onClick={() => navigate("/cart")}>
							<FaShoppingCart /> Cart
						</button>
						{cartItems && cartItems.length !== 0 && (
							<span className="badge badge-accent badge-sm absolute -top-1 -right-2">
								{cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
							</span>
						)}
					</div>
					<div className="mx-2">
						{userInfo ? (
							<div className="dropdown">
								<div tabIndex={0} role="button" className="btn btn-sm btn-ghost m-1">
									<FaUser /> {userInfo.name}
								</div>
								<ul
									tabIndex={0}
									className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
								>
									<li>
										<Link to="/profile">Profile</Link>
									</li>
									<li>
										<button onClick={logoutHandler}>Log out</button>
									</li>
								</ul>
							</div>
						) : (
							<button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
								<FaUser /> Log in
							</button>
						)}
						{userInfo && userInfo.isAdmin && (
							<div className="dropdown">
								<div tabIndex={0} role="button" className="btn btn-sm btn-ghost m-1">
									Admin
								</div>
								<ul
									tabIndex={0}
									className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow"
								>
									<li>
										<Link to="/admin/productlist">Products</Link>
									</li>
									<li>
										<Link to="/admin/userlist">Users</Link>
									</li>
									<li>
										<Link to="/admin/orderlist">Orders</Link>
									</li>
								</ul>
							</div>
						)}
					</div>
					<div className="ml-4">
						<ThemeController setTheme={setTheme} />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
