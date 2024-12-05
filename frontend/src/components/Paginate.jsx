import React from "react";
import { Link } from "react-router-dom";

const Paginate = ({ total, current, isAdmin = false, keyword }) => {
	return (
		<div className="join mt-10">
			{[...Array(total).keys()]
				.map(i => i + 1)
				.map(page => (
					<Link
						key={page}
						to={
							!isAdmin
								? `${keyword ? `/search/${keyword}` : ""}/page/${page}`
								: `/admin/productlist/${page}`
						}
						className={`join-item btn btn-secondary${
							Number(page) === Number(current) ? " btn-active" : ""
						}`}
					>
						{page}
					</Link>
				))}
		</div>
	);
};

export default Paginate;
