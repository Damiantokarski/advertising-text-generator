import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "../../ui/FormFields/Input/FormInput";
import { AuthButton } from "../../ui/AuthButton";
import { useAuth } from "../../hooks/useAuth";

type UserData = {
	email: string;
	password: string;
};

export const LoginPage = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<UserData>({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
	});

	const onSubmit = async (data: UserData) => {
		const session = await login(data.email, data.password);
		if (session != null) {
			navigate("/");
			reset();
		}
	};

	return (
		<div className="flex">
			<div className="w-full max-w-2xl bg-linear-to-l from-primary-blue to-primary-blue-sky h-screen shadow-2xl"></div>
			<div className="flex justify-center items-center w-full h-screen">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow w-full max-w-md"
				>
					<h1 className="text-4xl font-bold text-primary-blue mb-4">Welcome back!</h1>
					<FormInput
						id="email"
						label="Email"
						type="email"
						placeholder="email@example.com"
						error={errors.email?.message}
						register={register("email", {
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Invalid email format",
							},
						})}
					/>
					<FormInput
						id="password"
						label="Password"
						type="password"
						placeholder="*********"
						error={errors.password?.message}
						register={register("password", {
							required: "Password is required",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters",
							},
						})}
						autoComplete="current-password"
					/>

					<AuthButton type="submit" isSubmitting={isSubmitting} />

					<Link
						to="/register"
						className="text-xs text-center text-secondary-text hover:text-primary-blue transition-colors
                            flex justify-center w-full mt-4"
					>
						Don't have an account? Register now.
					</Link>
				</form>
			</div>
		</div>
	);
};
