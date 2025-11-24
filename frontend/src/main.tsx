import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModalProvider } from "./app/components/ModalProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ModalProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
				</Routes>
			</BrowserRouter>
		</ModalProvider>
	</StrictMode>
);
