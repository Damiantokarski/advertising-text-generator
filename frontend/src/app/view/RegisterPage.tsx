import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { FormInput } from "../Ui/FormFields/Input/FormInput";
import { AuthButton } from "../Ui/AuthButton";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

type FormData = {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
};

export const RegisterPage = () => {
    const { register: registerAuth } = useAuth();
    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: { email: "", name: "", password: "", confirmPassword: "" },
        mode: "onBlur",
    });
    const watchPassword = watch("password");
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        const res = await registerAuth(data.email, data.name, data.password);
        if (!res.ok) {
            setErrorMessage("Registration failed. Please try again.");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }
        setSuccessMessage("Account created! Redirecting to login...");
        reset();
        setTimeout(() => navigate("/login"), 1200);
    };

    return (
        <div className="flex">
            <div className="flex justify-center items-center w-full h-screen">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
                    <h1 className="text-2xl font-bold">register</h1>

                    <FormInput id="email" label="email" type="email" placeholder="email" error={errors.email?.message} register={register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                    })} required />

                    <FormInput id="name" label="name" type="text" placeholder="name" error={errors.name?.message} register={register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })} required />

                    <FormInput id="password" label="password" type="password" placeholder="password" error={errors.password?.message} register={register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })} required />

                    <FormInput id="confirmPassword" label="confirm password" type="password" placeholder="confirm password" error={errors.confirmPassword?.message} register={register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === watchPassword || "Passwords do not match",
                    })} required />

                    <AuthButton type="submit" isSubmitting={isSubmitting} disabled={isSubmitting}>Register</AuthButton>

                    <Link to="/login" className="text-xs text-center text-secondary-text hover:text-primary-blue transition-colors flex justify-center w-full mt-4">Already have an account? Login.</Link>
                </form>
            </div>
            <div className="w-full max-w-2xl bg-linear-to-r from-primary-ocean to-primary-ocean-active h-screen shadow-2xl"></div>

            {successMessage && <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">{successMessage}</div>}
            {errorMessage && <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow">{errorMessage}</div>}
        </div>
    );
};