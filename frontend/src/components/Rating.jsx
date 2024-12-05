import React from "react";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";

const Rating = ({ rating, reviews }) => {
	return (
		<div className="flex flex-row items-center">
			<div className="flex flex-row mr-1 items-center">
				{rating >= 1 ? <FaStar /> : rating >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
				{rating >= 2 ? <FaStar /> : rating >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar />}
				{rating >= 3 ? <FaStar /> : rating >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar />}
				{rating >= 4 ? <FaStar /> : rating >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar />}
				{rating >= 5 ? <FaStar /> : rating >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar />}
			</div>
			{reviews && <div>{reviews} reviews</div>}
		</div>
	);
};

export default Rating;
