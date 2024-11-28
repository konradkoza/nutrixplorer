import { UnitInput } from "@/components/common/UnitInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useUpdateBasketEntryMutation } from "@/redux/services/basketService";
import { useForm } from "react-hook-form";
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
                <DialogTitle>Zmień ilość produktu w koszyku</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangeQuantity)}>
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-5">
                                    <FormLabel className="col-span-1 mr-3 mt-2 place-content-center justify-self-end">
                                        Ilość
                                    </FormLabel>
                                    <FormControl className="col-span-3 mt-0">
                                        <UnitInput
                                            className=""
                                            unit={unit}
                                            type="number"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-5 gap-5">
                            <Button type="button" onClick={onClose} variant="outline">
                                Anuluj
                            </Button>
                            <Button type="submit">Zmień</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateQuantityDialog;
