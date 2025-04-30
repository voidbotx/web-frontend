// app/auth/page.tsx

"use client"; // Ensure this is at the top of the file

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // Change this line
import AuthContext from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not provided. Make sure to wrap your component with AuthProvider.");
    }

    const { login, register, isAuthenticated, error, clearError } = authContext;
    const router = useRouter();

    useEffect(() => {
        // If already authenticated, redirect to dashboard
        if (isAuthenticated) {
            router.push("/");
        }
        // Clear any previous errors
        clearError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, router]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        clearError();
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });

        // Clear password error when user types in password fields
        if (e.target.name === "password" || e.target.name === "confirmPassword") {
            setPasswordError("");
        }

        clearError();
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await login(loginData);
        setIsSubmitting(false);
        if (success) {
            router.push("/");
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        const success = await register({
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            avatar: registerData.avatar || undefined, // Only send if not empty
        });
        setIsSubmitting(false);
        if (success) {
            router.push("/");
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl">
                    {/* Left Side - Welcome Text */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
                        <div className="mb-4 text-center">
                            <h2 className="text-4xl font-bold text-gray-900">
                                Welcome to <span className="text-primary-600">MemedIn</span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                Connect with friends and share what matters to you.
                            </p>
                            <img
                                src="/media/images/welcome-image.svg"
                                alt="Welcome"
                                className="hidden lg:block w-full max-w-md mx-auto"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive" className="max-w-md mx-auto lg:mx-0">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                    {/* Right Side - Auth Tabs */}
                    <Tabs
                        defaultValue="login"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <TabsList className="flex w-full bg-gray-100 p-0 rounded-lg shadow-inner">
                            <TabsTrigger className="w-full text-sm font-semibold px-4 py-2 rounded-md transition-all duration-200 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black data-[state=inactive]:text-gray-500" value="login">Login</TabsTrigger>
                            <TabsTrigger className="w-full text-sm font-semibold px-4 py-2 rounded-md transition-all duration-200 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black data-[state=inactive]:text-gray-500" value="register">Register</TabsTrigger>
                        </TabsList>
                        {/* Login Form */}
                        <TabsContent value="login">
                            <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="text-sm text-primary-600 hover:underline"
                                        onClick={() => setActiveTab("register")}
                                    >
                                        Don't have an account? Register now
                                    </button>
                                </div>
                            </form>
                        </TabsContent>
                        {/* Register Form */}
                        <TabsContent value="register">
                            <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        value={registerData.username}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Password</Label>
                                    <Input
                                        id="register-password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                    {passwordError && (
                                        <p className="text-sm text-red-500">{passwordError}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : (
                                        "Create account"
                                    )}
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="text-sm text-primary-600 hover:underline"
                                        onClick={() => setActiveTab("login")}
                                    >
                                        Already have an account? Sign in
                                    </button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default AuthPage;