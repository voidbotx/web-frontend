import { AuthProvider } from "@/context/AuthContext";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <main>
                {children}
            </main>
        </AuthProvider>
    );
}
