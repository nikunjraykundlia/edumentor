"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { User as ApiUser, AuthResponse } from "@/lib/types";

export interface User {
    id: string;
    email: string;
    displayName: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { user: storeUser, isLoading, loadFromStorage, setAuth, logout: storeLogout } = useAuthStore();

    // Load JWT auth state from localStorage on mount
    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    // Sync local user state with store
    useEffect(() => {
        if (!isLoading) {
            if (storeUser) {
                const mapped: User = {
                    id: (storeUser as any)._id || (storeUser as any).id,
                    email: (storeUser as any).email,
                    displayName: (storeUser as any).name || (storeUser as any).email?.split("@")[0] || "",
                };
                setUser(mapped);
            } else {
                setUser(null);
            }
            setLoading(false);
        }
    }, [storeUser, isLoading]);

    // Route protection: redirect unauthenticated users away from protected routes
    useEffect(() => {
        if (!loading) {
            const isPublicRoute = PUBLIC_ROUTES.some(
                (route) => pathname === route || pathname.startsWith("/api")
            );

            if (!user && !isPublicRoute) {
                router.push("/login");
            }
        }
    }, [user, loading, pathname, router]);

    const clearError = () => setError(null);

    const handleAuthSuccess = (apiUser: ApiUser, accessToken: string, redirectTo: string) => {
        setAuth(apiUser as any, accessToken);
        setUser({
            id: apiUser._id,
            email: apiUser.email,
            displayName: apiUser.name,
        });
        router.push(redirectTo);
    };

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
            handleAuthSuccess(data.user as ApiUser, data.accessToken, "/dashboard");
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Failed to sign in";
            setError(message);
            throw err;
        }
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        try {
            setError(null);
            const { data } = await api.post<AuthResponse>("/auth/register", {
                name: displayName,
                email,
                password,
                role: "student",
            });
            handleAuthSuccess(data.user as ApiUser, data.accessToken, "/dashboard");
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Failed to sign up";
            setError(message);
            throw err;
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            try {
                await api.post("/auth/logout");
            } catch {
                // ignore backend logout failure
            }
            storeLogout();
            setUser(null);
            router.push("/login");
        } catch (err: any) {
            setError("Failed to sign out");
        }
    };

    const signInWithGoogle = async () => {
        setError("Google sign-in is disabled in this JWT-only setup.");
        return Promise.reject(new Error("Google sign-in is disabled"));
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, error, clearError }}
        >
            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />

                    <div className="flex flex-col items-center gap-8 relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            className="relative"
                        >
                            <motion.div
                                className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-2xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="h-24 w-24 rounded-3xl bg-card border border-border shadow-2xl flex items-center justify-center relative z-10 p-4">
                                <motion.img
                                    src="/icon.svg"
                                    alt="AskMyNotes"
                                    className="w-full h-full"
                                />
                            </div>
                        </motion.div>

                        <div className="flex flex-col items-center gap-2">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-heading font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500"
                            >
                                AskMyNotes
                            </motion.h2>
                        </div>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
