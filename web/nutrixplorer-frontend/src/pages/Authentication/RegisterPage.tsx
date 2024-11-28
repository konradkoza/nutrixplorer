import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/redux/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const RegisterSchema = z
    .object({
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string(),
        firstName: z.string(),
        lastName: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterFormType = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
    const [register] = useRegisterMutation();
    const form = useForm<RegisterFormType>({
        values: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
        },
        resolver: zodResolver(RegisterSchema),
    });
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterFormType) => {
        try {
            await register({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
            });
            navigate("/login", { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Utwórz nowe konto</CardTitle>
                    <CardDescription>
                        Uzupełnij poniższe pola, aby utworzyć nowe konto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="grid grid-cols-2 gap-4"
                            onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Imię</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="name" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nazwisko</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="family-name"
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="email"
                                                type="email"
                                                placeholder=""
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Hasło</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="new-password"
                                                placeholder=""
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Powtórz hasło</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="new-password"
                                                placeholder=""
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-2" type="submit">
                                Utwórz konto
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        {"Masz już konto? "}
                        <Link className="underline" to="/login">
                            Zaloguj się
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage;
