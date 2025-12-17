import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ModalProvider } from "./app/components/ModalProvider.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store/store.ts";
import { Generator } from "./app/view/generator/Generator.tsx";
import { Toaster } from "react-hot-toast";
import { toasterConfig } from "./config/toast.config.ts";
import { AuthProvider } from "./app/auth/AuthProvider.tsx";
import { ProtectedRoute } from "./app/auth/ProtectedRoute.tsx";
import { PublicRoute } from "./app/auth/PublicRoute.tsx";
import { RegisterPage } from "./app/view/RegisterPage.tsx";
import { LoginPage } from "./app/view/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<Provider store={store}>
				<ModalProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
							<Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
							<Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
							<Route path="/text-generator/project/:id" element={
								<ProtectedRoute><Generator /></ProtectedRoute>}
							/>
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
						<Toaster {...toasterConfig} />
					</BrowserRouter>
				</ModalProvider>
			</Provider>
		</AuthProvider>
	</StrictMode>
);
