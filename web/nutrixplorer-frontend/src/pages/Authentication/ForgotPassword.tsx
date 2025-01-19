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
import {
    getResetPasswordSchema,
    ResetPasswordFormType,
} from "@/types/schemas/AuthenticationSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useForgotPasswordMutation } from "@/redux/services/authService";

import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [forgotPassword] = useForgotPasswordMutation();
    const [t] = useTranslation(TranslationNS.Authentication);
    const form = useForm<ResetPasswordFormType>({
        values: {
            email: "",
        },
        resolver: zodResolver(getResetPasswordSchema(t)),
    });
    const navigate = useNavigate();
    const onSubmit = async (data: ResetPasswordFormType) => {
        try {
            await forgotPassword(data.email);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("reset.title")}</CardTitle>
                    <CardDescription>{t("reset.description")}</CardDescription>
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
                                        <FormLabel>{t("reset.email")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@mail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t("reset.submit")}</Button>
                        </form>
                    </Form>
                    <div>
                        <Button
                            className="w-full text-center"
                            variant="link"
                            onClick={() => {
                                navigate("/login");
                            }}>
                            {t("reset.backToLogin")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
