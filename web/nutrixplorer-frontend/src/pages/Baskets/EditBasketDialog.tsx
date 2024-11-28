import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBasketMutation } from "@/redux/services/basketService";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
                <DialogTitle>Edytuj koszyk</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangeQuantity)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa</FormLabel>
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
                                    <FormLabel>Opis</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-5 gap-5">
                            <Button type="button" onClick={onClose} variant="outline">
                                Anuluj
                            </Button>
                            <Button type="submit">Zapisz</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBasketDialog;
