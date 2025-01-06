import { UnitInput } from "@/components/common/UnitInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useUpdateBasketEntryMutation } from "@/redux/services/basketService";
import { TranslationNS } from "@/utils/translationNamespaces";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const UpdateQuantitySchema = z.object({
    quantity: z.number(),
});

type UpdateQuantityFormType = z.infer<typeof UpdateQuantitySchema>;

type AddBasketDialogProps = {
    currentQuantity: number;
    entryId: string;
    open: boolean;
    onClose: () => void;
    unit: string;
};

const UpdateQuantityDialog = ({
    currentQuantity,
    entryId,
    open,
    onClose,
    unit,
}: AddBasketDialogProps) => {
    const [updateQuantity] = useUpdateBasketEntryMutation();
    const [t] = useTranslation(TranslationNS.Baskets);
    const form = useForm<UpdateQuantityFormType>({
        values: {
            quantity: currentQuantity,
        },
    });
    const handleChangeQuantity = (data: UpdateQuantityFormType) => {
        updateQuantity({ entryId: entryId, quantity: data.quantity });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-96">
                <DialogTitle>{t("updateQuantityTitle")}</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangeQuantity)}>
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-5">
                                    <FormLabel className="col-span-1 mr-3 mt-2 place-content-center justify-self-end">
                                        {t("quantity")}:
                                    </FormLabel>
                                    <FormControl className="col-span-3 mt-0">
                                        <UnitInput
                                            className=""
                                            unit={unit}
                                            type="number"
                                            {...field}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.code === "Minus" ||
                                                    event.code === "NumpadSubtract" ||
                                                    event.code === "Period" ||
                                                    event.code === "Comma"
                                                ) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                if (Number(e.target.value) < 0) {
                                                    field.onChange(0);
                                                } else {
                                                    field.onChange(e.target.value);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-5 gap-5">
                            <Button type="button" onClick={onClose} variant="outline">
                                {t("cancel")}
                            </Button>
                            <Button type="submit">{t("change")}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateQuantityDialog;
