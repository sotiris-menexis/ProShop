import React from "react";

const FormInput = ({
	title,
	value,
	setValue,
	placeholder,
	cName = "input input-bordered w-full",
	type,
	containerWidth = " w-full",
}) => {
	return (
		<label className={`form-control${containerWidth}`}>
			<div className="label">
				<span className="label-text">{title}</span>
			</div>
			<input
				value={value}
				onChange={e => setValue(e.target.value)}
				type={type}
				placeholder={placeholder}
				className={cName}
			/>
		</label>
	);
};

export default FormInput;
