import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

const QtySelector = ({ qty, onQtyChange, countInStock }) => {
	return (
		<div className="flex flex-row gap-2">
			<button
				onClick={() => onQtyChange("reduce")}
				className={`btn btn-accent btn-sm${qty > 1 ? "" : " btn-disabled"}`}
			>
				<FaMinus />
			</button>
			<span className="font-semibold text-lg w-8 text-center">{qty}</span>
			<button
				className={`btn btn-accent btn-sm${qty < countInStock ? "" : " btn-disabled"}`}
				onClick={() => onQtyChange("add")}
			>
				<FaPlus />
			</button>
		</div>
	);
};

export default QtySelector;
