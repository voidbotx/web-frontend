import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
           <Navbar />
            <div className="flex min-h-screen">
                <LeftSidebar />
                <main className="flex-1 max-w-2xl mx-auto p-6">
                    {children}
                </main>
                
            </div>
        </AuthProvider>
    );
}
