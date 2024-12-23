import { useChangePasswordWithTokenMutation } from "@/redux/services/authService";
import {
    ChangePasswordFormType,
    getChangePasswordSchema,
} from "@/types/schemas/AuthenticationSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { toast } from "sonner";

const PasswordResetPage = () => {
    const [changePassword] = useChangePasswordWithTokenMutation();
    const [t] = useTranslation(TranslationNS.Authentication);
    const form = useForm<ChangePasswordFormType>({
        values: {
            newPassword: "",
            confirmPassword: "",
        },
        resolver: zodResolver(getChangePasswordSchema(t)),
    });
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const onSubmit = async (data: ChangePasswordFormType) => {
        try {
            if (params.get("token")) {
                await changePassword({
                    newPassword: data.newPassword,
                    token: params.get("token")!,
                });
                navigate("/login", { replace: true });
            } else {
                toast.error(t("newPassword.error", { message: t("newPassword.invalidToken") }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
            <Card className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("newPassword.title")}</CardTitle>
                    <CardDescription>{t("newPassword.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>{t("newPassword.password")}</FormLabel>
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
                                        <FormLabel>{t("newPassword.confirmPassword")}</FormLabel>
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
                            <Button type="submit">{t("newPassword.submit")}</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PasswordResetPage;
