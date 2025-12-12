import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModalProvider } from "./app/components/ModalProvider.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store/store.ts";
import { Generator } from "./app/view/generator/Generator.tsx";
import { Toaster } from "react-hot-toast";
import { toasterConfig } from "./config/toast.config.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<ModalProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/text-generator/project/:id" element={<Generator />} />
					</Routes>
					<Toaster {...toasterConfig} />
				</BrowserRouter>
			</ModalProvider>
		</Provider>
	</StrictMode>
);
