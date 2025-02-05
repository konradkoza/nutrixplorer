import { PasswordInput } from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useChangePasswordMutation } from "@/redux/services/meService";
import {
    ChangeOwnPasswordFormType,
    getChangeOwnPasswordSchema,
} from "@/types/schemas/AuthenticationSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ChangePasswordDialog = () => {
    const [changePassword] = useChangePasswordMutation();
    const [t] = useTranslation(TranslationNS.Account);
    const [open, setOpen] = useState(false);
    const form = useForm<ChangeOwnPasswordFormType>({
        values: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        resolver: zodResolver(getChangeOwnPasswordSchema(t)),
    });

    const onSubmit = async (data: ChangeOwnPasswordFormType) => {
        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2">
                    <span>{t("changePassword")}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("changePassword")}</DialogTitle>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>{t("newPassword.oldPassword")}</FormLabel>
                                        <FormControl>
                                            <PasswordInput autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>{t("newPassword.password")}</FormLabel>
                                        <FormControl>
                                            <PasswordInput autoComplete="new-password" {...field} />
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
                                            <PasswordInput autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t("newPassword.submit")}</Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
