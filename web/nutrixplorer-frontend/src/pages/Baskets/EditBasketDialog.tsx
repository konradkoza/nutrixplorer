import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddBasketDialogFormType, getAddBasketSchema } from "@/types/schemas/BasketSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type AddBasketDialogProps = {
    currentName: string;
    currentDescription: string;
    basketId: string;
    open: boolean;
    onClose: () => void;
    editBasket: (data: AddBasketDialogFormType) => void;
};

const EditBasketDialog = ({
    currentName,
    currentDescription,
    open,
    onClose,
    editBasket,
}: AddBasketDialogProps) => {
    const { t } = useTranslation(TranslationNS.Baskets);

    const form = useForm<AddBasketDialogFormType>({
        values: {
            name: currentName,
            description: currentDescription,
        },
        resolver: zodResolver(getAddBasketSchema(t)),
    });
    const handleChangeQuantity = (data: AddBasketDialogFormType) => {
        editBasket(data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-96">
                <DialogTitle>{t("editBasket")}</DialogTitle>
                <Form {...form}>
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={form.handleSubmit(handleChangeQuantity)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.description?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-5 gap-5">
                            <Button type="button" onClick={onClose} variant="outline">
                                {t("cancel")}
                            </Button>
                            <Button type="submit">{t("save")}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBasketDialog;
