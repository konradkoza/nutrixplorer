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
import { Textarea } from "@/components/ui/textarea";
import { useCreateBasketMutation } from "@/redux/services/basketService";
import { CreateBasket } from "@/types/BasketTypes";
import { AddBasketDialogFormType, getAddBasketSchema } from "@/types/schemas/BasketSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type AddBasketDialogProps = {
    addBasket?: (basket: CreateBasket) => void;
};

const AddBasketDialog = ({ addBasket }: AddBasketDialogProps) => {
    const { t } = useTranslation(TranslationNS.Baskets);
    const form = useForm<AddBasketDialogFormType>({
        values: {
            name: "",
            description: undefined,
        },
        resolver: zodResolver(getAddBasketSchema(t)),
    });
    const [open, setOpen] = useState(false);
    const [createBasket] = useCreateBasketMutation();

    const handleAddBasket = async (data: AddBasketDialogFormType) => {
        if (addBasket) {
            await addBasket(data);
        } else {
            createBasket(data);
        }
        form.reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-2">
                    <PlusIcon className="h-4 w-4" />
                    <span>{t("addBasket")}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("createNewBasket")}</DialogTitle>
                    <Form {...form}>
                        <form
                            // Prevents closing another dialog
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    form.handleSubmit(handleAddBasket)();
                                }
                            }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(handleAddBasket);
                            }}
                            className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("name")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage>
                                            {form.formState.errors.name?.message}
                                        </FormMessage>
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
                            {/* Prevents closing another dialog */}
                            <Button onClick={form.handleSubmit(handleAddBasket)} type="button">
                                {t("add")}
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddBasketDialog;
