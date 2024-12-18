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
import { getRegisterSchema, RegisterFormType } from "@/types/schemas/AuthenticationSchema";
import { oauthUrl } from "@/utils/oatuhUrl";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [register] = useRegisterMutation();
    const [t] = useTranslation(TranslationNS.Authentication);
    const form = useForm<RegisterFormType>({
        values: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
        },
        resolver: zodResolver(getRegisterSchema(t)),
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
                    <CardTitle className="text-2xl">{t("register.title")}</CardTitle>
                    <CardDescription>{t("register.description")}</CardDescription>
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
                                        <FormLabel>{t("register.firstName")}</FormLabel>
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
                                        <FormLabel>{t("register.lastName")}</FormLabel>
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
                                        <FormLabel>{t("register.email")}</FormLabel>
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
                                        <FormLabel>{t("register.password")}</FormLabel>
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
                                        <FormLabel>{t("register.confirmPassword")}</FormLabel>
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
                                {t("register.submit")}
                            </Button>
                        </form>
                    </Form>
                    <Button
                        type="button"
                        className="mt-2 w-full gap-2"
                        variant="outline"
                        onClick={() => {
                            window.location.href = oauthUrl;
                        }}>
                        <FcGoogle size={20} /> {t("register.google")}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        {t("register.alreadyHaveAccount")}{" "}
                        <Link className="underline" to="/login">
                            {t("register.login")}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage;
