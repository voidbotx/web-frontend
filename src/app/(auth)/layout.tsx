import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <main>
                {children}
            </main>
        </AuthProvider>
    );
}
