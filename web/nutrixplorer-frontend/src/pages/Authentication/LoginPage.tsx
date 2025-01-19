import { PasswordInput } from "@/components/common/PasswordInput";
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
import { getLoginSchema, LoginFormType } from "@/types/schemas/AuthenticationSchema";
import { oauthUrl } from "@/utils/oatuhUrl";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [loginMutation] = useLoginMutation();
    const [t, i18n] = useTranslation(TranslationNS.Authentication);
    const form = useForm<LoginFormType>({
        values: {
            email: "",
            password: "",
        },
        resolver: zodResolver(getLoginSchema(t)),
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data: LoginFormType) => {
        try {
            const response = await loginMutation({
                ...data,
                language: i18n.language as "pl" | "en",
            });
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
                                    <FormItem className="w-full">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>{t("login.password")}</FormLabel>
                                            <Button
                                                tabIndex={-1}
                                                asChild
                                                variant="link"
                                                type="button"
                                                className="h-fit w-fit p-1">
                                                <Link className="text-sm" to="/forgot-password">
                                                    {t("login.forgotPassword")}
                                                </Link>
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <PasswordInput placeholder="" {...field} />
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
