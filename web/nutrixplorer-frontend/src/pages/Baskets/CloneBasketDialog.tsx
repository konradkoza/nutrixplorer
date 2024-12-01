import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCloneBasketMutation } from "@/redux/services/basketService";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CloneBasketSchema = z.object({
    name: z.string(),
    description: z.string(),
});

type CloneBasketFormType = z.infer<typeof CloneBasketSchema>;

type AddBasketDialogProps = {
    currentName: string;
    basketId: string;
    open: boolean;
    onClose: () => void;
};

const CloneBasketDialog = ({ currentName, basketId, open, onClose }: AddBasketDialogProps) => {
    const [cloneBasket] = useCloneBasketMutation();

    const form = useForm<CloneBasketFormType>({
        values: {
            name: currentName + " - kopia",
            description: "",
        },
    });
    const handleChangeQuantity = (data: CloneBasketFormType) => {
        cloneBasket({ basketId: basketId, basket: data });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-96">
                <DialogTitle>Duplikuj koszyk</DialogTitle>
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
                            <Button type="submit">Kopiuj</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CloneBasketDialog;
