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
import { useLoginMutation } from "@/redux/services/authService";
import { login } from "@/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { oauthUrl } from "@/utils/oatuhUrl";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/types/TranslationNamespaces";
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
    const [t] = useTranslation(TranslationNS.Authentication);
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
                    <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
                    <CardDescription>{t("login.description")}</CardDescription>
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
                                        <FormLabel>{t("login.email")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@mail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("login.password")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t("login.submit")}</Button>
                        </form>
                    </Form>
                    <Button
                        type="button"
                        className="mt-2 w-full gap-2"
                        variant="outline"
                        onClick={() => {
                            window.location.href = oauthUrl;
                        }}>
                        <FcGoogle size={20} /> {t("login.google")}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        {t("login.noAccount")}{" "}
                        <Link className="underline" to="/register">
                            {t("login.createAccount")}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
