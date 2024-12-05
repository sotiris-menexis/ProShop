import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
	const navigate = useNavigate();
	const { keyword: urlKeyword } = useParams();
	const [keyword, setKeyword] = useState(urlKeyword ? urlKeyword : "");

	const submitHandler = e => {
		e.preventDefault();
		if (keyword.trim()) {
			navigate(`/search/${keyword}`);
		} else {
			navigate("/");
		}
	};

	return (
		<form onSubmit={submitHandler} className="flex flex-row">
			<label className="input input-bordered input-sm flex items-center gap-2 max-w-36 rounded-r-none">
				{/* <FaSearch /> */}
				<input
					type="text"
					value={keyword}
					onChange={e => setKeyword(e.target.value)}
					className="grow"
					placeholder="Search Products..."
				/>
			</label>
			<button type="submit" className="btn btn-accent btn-sm rounded-l-none">
				search
			</button>
		</form>
	);
};

export default SearchBox;
