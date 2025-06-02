"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Stethoscope } from "lucide-react";
import Cookies from 'js-cookie';
import { api } from "@/services/api";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    React.useEffect(() => {
        if (Cookies.get('isAuthenticated') === 'true') {
            router.replace('/patients');
        }
    }, [router]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            // Replace with actual API call when available
            // const response = await api.login(data.email, data.password);

            // For now, using the mock login
            if (data.email === "user@example.com" && data.password === "password123") {
                Cookies.set('isAuthenticated', 'true', { expires: 7 });
                toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                });
                router.push("/patients");
            } else {
                toast({
                    title: "Login Failed",
                    description: "Invalid email or password.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred during login. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <Card className="w-full max-w-md shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10 relative z-10 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                        <Stethoscope size={40} className="animate-pulse" />
                    </div>
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                        Sansys EHR
                    </CardTitle>
                    <CardDescription className="text-gray-200 text-lg mt-2">Access your patient dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200 text-lg">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="user@example.com"
                                                {...field}
                                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 backdrop-blur-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-300" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200 text-lg">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400 transition-all duration-300 backdrop-blur-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-300" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl font-semibold text-lg py-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : "Login"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 