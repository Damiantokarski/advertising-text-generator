import { type ToasterProps } from "react-hot-toast";

export const toasterConfig: ToasterProps = {
	position: "top-right",
	reverseOrder: false,
	gutter: 8,
	containerStyle: {
		top: 80,
		right: "42%",
	},
	toasterId: "default",
	toastOptions: {
		duration: 3000,
		removeDelay: 1000,
		success: {
			duration: 3000,
			iconTheme: {
				primary: "green",
				secondary: "white",
			},
		},
	},
};
