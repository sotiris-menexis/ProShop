import React from "react";

const Dialog = ({
	dialogId,
	cName = "modal",
	confirmHandler,
	yesButtonText,
	noButtonText,
	title,
	description,
}) => {
	return (
		<dialog id={dialogId} className={cName}>
			<div className="modal-box">
				<h3 className="font-bold text-lg">{title}</h3>
				<p className="py-4">{description}</p>
				<div className="flex flex-row gap-4 justify-center">
					<button onClick={confirmHandler} className="btn btn-success btn-sm">
						{yesButtonText}
					</button>
					<button
						onClick={() => document.getElementById("create_product_dialog").close()}
						className="btn btn-error btn-sm"
					>
						{noButtonText}
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop"></form>
		</dialog>
	);
};

export default Dialog;
