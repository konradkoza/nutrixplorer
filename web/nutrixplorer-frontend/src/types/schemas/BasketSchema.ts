import { TFunction } from "i18next";
import { z } from "zod";

export const getAddToBasketSchema = (t: TFunction) => {
    return z.object({
        quantity: z.coerce
            .number()
            .gt(0, { message: t("errors.quantity") })
            .lt(10000, { message: t("errors.quantityMax") }),
        basketId: z.string().min(1, { message: t("errors.basketId") }),
    });
};

export type AddToBasketForm = z.infer<ReturnType<typeof getAddToBasketSchema>>;

export const getAddBasketSchema = (t: TFunction) => {
    return z.object({
        name: z
            .string()
            .min(3, { message: t("errors.nameMinLength") })
            .max(65, { message: t("errors.nameMaxLength") }),
        description: z
            .string()
            .max(2000, { message: t("errors.descriptionMaxLength") })
            .optional(),
    });
};

export type AddBasketDialogFormType = z.infer<ReturnType<typeof getAddBasketSchema>>;
