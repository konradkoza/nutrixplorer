import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/redux/services/authService";
import { login } from "@/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string(),
    password: z.string(),
});

type LoginFormType = z.infer<typeof LoginSchema>;

const LoginPage = () => {
    const [loginMutation] = useLoginMutation();
    const form = useForm<LoginFormType>({
        values: {
            email: "",
            password: "",
        },
        resolver: zodResolver(LoginSchema),
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onSubmit = async (data: LoginFormType) => {
        try {
            const response = await loginMutation(data);
            if (response.data) {
                dispatch(login(response.data));
                navigate("/");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="example@mail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Login</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
