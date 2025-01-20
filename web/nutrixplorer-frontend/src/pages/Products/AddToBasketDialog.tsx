import AutocompleteSelect from "@/components/common/AutocompleteSelect";
import { UnitInput } from "@/components/common/UnitInput";
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
import {
    useAddBasketEntryMutation,
    useCreateBasketMutation,
    useGetFilteredBasketsListQuery,
} from "@/redux/services/basketService";
import { CreateBasket } from "@/types/BasketTypes";
import { AddToBasketForm, getAddToBasketSchema } from "@/types/schemas/BasketSchema";
import { TranslationNS } from "@/utils/translationNamespaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import AddBasketDialog from "../Baskets/AddBasketDialog";

type AddToBasketDialogProps = {
    open: boolean;
    onClose: () => void;
    productId: string;
    unit: string;
    productName: string;
};

const AddToBasketDialog = ({
    open,
    onClose,
    productId,
    unit,
    productName,
}: AddToBasketDialogProps) => {
    const { t } = useTranslation(TranslationNS.Products);
    const [searchValue, setSearchValue] = useState<string>("");
    const [value] = useDebounce(searchValue, 100);
    const { data: basketList, isLoading } = useGetFilteredBasketsListQuery(value);
    // const { data: basketList, isLoading } = useGetUserBasketsListQuery();
    const [createBasket] = useCreateBasketMutation();
    const [addEntry] = useAddBasketEntryMutation();
    const form = useForm<AddToBasketForm>({
        values: {
            quantity: 0,
            basketId: "",
        },
        resolver: zodResolver(getAddToBasketSchema(t)),
    });

    const handleAddToBasket = (data: AddToBasketForm) => {
        addEntry({ basketId: data.basketId, entry: { productId, quantity: data.quantity } });
        setSearchValue("");
        form.reset();
        onClose();
    };

    const close = () => {
        setSearchValue("");
        form.setValue("basketId", "");
        form.reset();
        onClose();
    };
    const handleBasketCreation = async (data: CreateBasket) => {
        try {
            const response = await createBasket(data);
            if (response.data) {
                setSearchValue(response.data.name);
                form.setValue("basketId", response.data.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent>
                <DialogTitle>
                    {t("addToBasket.addToBasket")} ({productName})
                </DialogTitle>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddToBasket)}>
                        <div className="flex-col justify-around sm:flex sm:flex-row">
                            <FormField
                                control={form.control}
                                name="basketId"
                                render={({ field }) => (
                                    <FormItem>
                                        <AutocompleteSelect
                                            errorMessage={form.formState.errors.basketId?.message}
                                            selectedValue={field.value}
                                            setSelectedValue={field.onChange}
                                            searchValue={searchValue}
                                            setSearchValue={(e) => {
                                                setSearchValue(e);
                                            }}
                                            suggestions={
                                                basketList
                                                    ? basketList.map((basket) => {
                                                          return {
                                                              value: basket.id,
                                                              label: basket.name,
                                                          };
                                                      })
                                                    : []
                                            }
                                            emptyMessage={t("noProducts")}
                                            label={t("addToBasket.basket")}
                                            placeholder={t("addToBasket.search")}
                                            isLoading={isLoading}
                                        />
                                        <FormMessage>
                                            {form.formState.errors.basketId?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-[180px]">
                                        <FormLabel>{t("addToBasket.quantity")}</FormLabel>
                                        <FormControl>
                                            <UnitInput
                                                className=""
                                                unit={unit}
                                                type="number"
                                                {...field}
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.code === "Minus" ||
                                                        event.code === "NumpadSubtract"
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
                                        <FormMessage>
                                            {form.formState.errors.quantity?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-5 flex flex-row justify-between gap-5 sm:flex-row sm:justify-between">
                            <AddBasketDialog addBasket={handleBasketCreation} />
                            <div className="flex gap-5">
                                <Button onClick={onClose} type="button" variant="outline">
                                    {t("addToBasket.cancel")}
                                </Button>
                                <Button type="submit">{t("addToBasket.add")}</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToBasketDialog;
