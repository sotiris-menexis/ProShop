/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx}"],
	theme: {
		extend: {
			minWidth: { 128: "32rem", 256: "64rem", 384: "96rem" },
			maxWidth: {
				128: "32rem",
				256: "64rem",
				384: "96rem",
			},
		},
	},
	daisyui: {
		themes: ["fantasy", "coffee"],
	},
	plugins: [require("daisyui")],
};
