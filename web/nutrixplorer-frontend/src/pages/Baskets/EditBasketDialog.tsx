import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBasketMutation } from "@/redux/services/basketService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "@/types/TranslationNamespaces";

const EditBasketSchema = z.object({
    name: z.string(),
    description: z.string(),
});

type EditBasketFormType = z.infer<typeof EditBasketSchema>;

type AddBasketDialogProps = {
    currentName: string;
    currentDescription: string;
    basketId: string;
    open: boolean;
    onClose: () => void;
};

const EditBasketDialog = ({
    currentName,
    currentDescription,
    basketId,
    open,
    onClose,
}: AddBasketDialogProps) => {
    const { t } = useTranslation(TranslationNS.Baskets);
    const [editBasket] = useUpdateBasketMutation();

    const form = useForm<EditBasketFormType>({
        values: {
            name: currentName,
            description: currentDescription,
        },
    });
    const handleChangeQuantity = (data: EditBasketFormType) => {
        editBasket({ basketId: basketId, basket: data });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-96">
                <DialogTitle>{t("editBasket")}</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangeQuantity)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
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
