import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Here we could call our backend for validation if we wanted to sync next-auth with our custom JWT
                // But for now we focus on Google.
                return null;
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Send to our backend to create/link user and get our custom JWT
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            googleId: user.id
                        }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        // Store our custom token in a way accessible to the frontend
                        // NextAuth doesn't easily allow setting localStorage from worker
                        // We might need to pass it in the session
                        user.accessToken = data.data.accessToken;
                        return true;
                    }
                } catch (error) {
                    console.error("Google sync error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            (session as any).user.role = token.role;
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
};
