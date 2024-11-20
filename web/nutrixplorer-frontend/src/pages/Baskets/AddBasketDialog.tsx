import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBasketMutation } from "@/redux/services/basketService";
import { CreateBasket } from "@/types/BasketTypes";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddBasketDialog = () => {
    const form = useForm<CreateBasket>({
        values: {
            name: "",
            description: "",
        },
    });
    const [open, setOpen] = useState(false);
    const [createBasket] = useCreateBasketMutation();
    const handleAddBasket = (data: CreateBasket) => {
        createBasket(data);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-2">
                    <PlusIcon className="h-4 w-4" />
                    <span>Dodaj koszyk</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Utwórz nowy koszyk</DialogTitle>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleAddBasket)}
                            className="flex flex-col gap-2">
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
                            <Button type="submit">Dodaj</Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddBasketDialog;
