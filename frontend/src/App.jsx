import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import { useState } from "react";

function App() {
	const [theme, setTheme] = useState("fantasy");
	return (
		<div data-theme={theme}>
			<Header setTheme={setTheme} />
			<main className="min-h-screen flex flex-row justify-center">
				<div className="container max-w-screen-xl w-full p-4">
					<Outlet />
				</div>
			</main>
			<ToastContainer />
		</div>
	);
}

export default App;
