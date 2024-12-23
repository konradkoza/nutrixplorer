import { TFunction } from "i18next";
import { z } from "zod";

export const getLoginSchema = (t: TFunction) => {
    return z.object({
        email: z
            .string()
            .min(1, { message: t("errors.emailRequired") })
            .email(t("errors.email")),
        password: z.string().min(8, t("errors.passwordRequired")),
    });
};

export type LoginFormType = z.infer<ReturnType<typeof getLoginSchema>>;

export const getResetPasswordSchema = (t: TFunction) => {
    return z.object({
        email: z
            .string()
            .min(1, { message: t("errors.emailRequired") })
            .email(t("errors.email")),
    });
};

export type ResetPasswordFormType = z.infer<ReturnType<typeof getResetPasswordSchema>>;


export const getChangePasswordSchema = (t: TFunction) => {
    return z.object({
        newPassword: z.string() .min(8, { message: t("errors.passwordRequired") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: t("errors.passwordPattern"),
        }),
        confirmPassword: z.string().min(8, t("errors.passwordRequired")),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t("errors.passwordsDontMatch"),
        path: ["confirmPassword"],
    });
}

export type ChangePasswordFormType = z.infer<ReturnType<typeof getChangePasswordSchema>>;

export const getChangeOwnPasswordSchema = (t: TFunction) => {
    return z.object({
        oldPassword: z.string().min(8, t("errors.passwordRequired")),
        newPassword: z.string() .min(8, { message: t("errors.passwordRequired") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: t("errors.passwordPattern"),
        }),
        confirmPassword: z.string().min(8, t("errors.passwordRequired")),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t("errors.passwordsDontMatch"),
        path: ["confirmPassword"],
    });
}

export type ChangeOwnPasswordFormType = z.infer<ReturnType<typeof getChangeOwnPasswordSchema>>;

export const getRegisterSchema = (t: TFunction) => {
    return z
        .object({
            email: z
                .string()
                .email(t("errors.email"))
                .min(1, { message: t("errors.emailRequired") }),
            password: z
                .string()
                .min(8, { message: t("errors.passwordRequired") })
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
                    message: t("errors.passwordPattern"),
                }),
            confirmPassword: z.string(),
            firstName: z.string().min(3, { message: t("errors.firstName") }),
            lastName: z.string().min(3, { message: t("errors.lastName") }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("errors.passwordsDontMatch"),
            path: ["confirmPassword"],
        });
};

export type RegisterFormType = z.infer<ReturnType<typeof getRegisterSchema>>;
