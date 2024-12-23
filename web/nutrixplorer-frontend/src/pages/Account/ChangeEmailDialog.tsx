import { useChangeEmailMutation } from "@/redux/services/meService";
import {
    ChangeEmailFormType,
    getChangeEmailSchema,
} from "@/types/schemas/AccountModificationSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ChangeEmailDialog = () => {
    const [changeEmail] = useChangeEmailMutation();
    const [t] = useTranslation(TranslationNS.Account);
    const [open, setOpen] = useState(false);
    const form = useForm<ChangeEmailFormType>({
        values: {
            email: "",
        },
        resolver: zodResolver(getChangeEmailSchema(t)),
    });

    const onSubmit = async (data: ChangeEmailFormType) => {
        try {
            await changeEmail(data.email);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="absolute right-0 top-0">
                    <span>{t("changeEmail")}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("changeEmail")}</DialogTitle>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("emailLabel")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@mail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t("submitEmail")}</Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeEmailDialog;
