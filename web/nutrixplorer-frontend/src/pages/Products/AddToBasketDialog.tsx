import { UnitInput } from "@/components/common/UnitInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useAddBasketEntryMutation,
    useGetUserBasketsListQuery,
} from "@/redux/services/basketService";
import { useForm } from "react-hook-form";

type AddToBasketDialogProps = {
    open: boolean;
    onClose: () => void;
    productId: string;
    unit: string;
};

type AddToBasketForm = {
    quantity: number;
    basketId: string;
};

const AddToBasketDialog = ({ open, onClose, productId, unit }: AddToBasketDialogProps) => {
    const { data: basketList, isLoading } = useGetUserBasketsListQuery();
    const [addEntry] = useAddBasketEntryMutation();
    const form = useForm<AddToBasketForm>({
        values: {
            quantity: 0,
            basketId: "",
        },
    });

    const handleAddToBasket = (data: AddToBasketForm) => {
        addEntry({ basketId: data.basketId, entry: { productId, quantity: data.quantity } });
        onClose();
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Dodaj do koszyka</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddToBasket)}>
                        <div className="flex justify-around">
                            <FormField
                                control={form.control}
                                name="basketId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Koszyk</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Wybierz koszyk 1" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Koszyk</SelectLabel>
                                                    {!isLoading &&
                                                        basketList?.map((basket) => (
                                                            <SelectItem
                                                                key={basket.id}
                                                                value={basket.id}>
                                                                {basket.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem className="w-[180px]">
                                        <FormLabel>Ilość</FormLabel>
                                        <FormControl>
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
                        </div>
                        <DialogFooter className="mt-5 gap-5">
                            <Button onClick={onClose} variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToBasketDialog;
