import { TFunction } from "i18next";
import { z } from "zod";

export const getChangeEmailSchema = (t: TFunction) => {
    return z.object({
        email: z
            .string()
            .min(1, { message: t("errors.emailRequired") })
            .email(t("errors.email")),
    });
};

export type ChangeEmailFormType = z.infer<ReturnType<typeof getChangeEmailSchema>>;

export const getChangeNameSchema = (t: TFunction) => {
    return z.object({
        firstName: z.string().min(1, t("errors.firstNameRequired")),
        lastName: z.string().min(1, t("errors.lastNameRequired")),
    });
};

export type ChangeNameFormType = z.infer<ReturnType<typeof getChangeNameSchema>>;
