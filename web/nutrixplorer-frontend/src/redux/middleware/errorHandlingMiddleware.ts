import i18next from "@/i18n";
import { TranslationNS } from "@/utils/translationNamespaces";
import { isFulfilled, isRejected, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { logout } from "../slices/authSlice";

type ErrorPayload = {
    data?: {
        errorCode: string;
        message: string;
    };
    status?: number;
};
// prettier-ignore
export const rtkQueryErrorHandler: Middleware = (api: MiddlewareAPI) => (next) => async (action) => {
        if (isRejected(action)) {
            const error = action.payload as ErrorPayload;
            console.log("error", error);
            if (i18next.isInitialized) {
                if(error && error.data && !error.data.errorCode) {
                    toast.error(i18next.t("error", { ns: TranslationNS.Error }), {
                        description: i18next.t("unexpectedError", { ns: TranslationNS.Error })
                    });
                    return next(action);
                }
                if(error && error.status === 401) {
                    toast.error(i18next.t("sessionExpiredTitle", { ns: TranslationNS.Error }), {
                        description: i18next.t("sessionExpired", { ns: TranslationNS.Error }),
                    });
                    api.dispatch(logout());
                    return next(action);
                }
                toast.error(i18next.t("error", { ns: TranslationNS.Error }), {
                    description: error && error.data
                        ? i18next.t(error.data.errorCode, { ns: TranslationNS.Error })
                        : i18next.t("connectionError", { ns: TranslationNS.Error }),
                });
                return next(action);
            } else {
                toast.error("Error", {
                    description: error.data ? error.data.message : "Connection error",
                });
                return next(action);
            }
        }
        if (isFulfilled(action)) {
            // prettier-ignore
            // @ts-expect-error ignore type error
            if (action.meta.arg.type === "mutation" && action.meta.arg.endpointName !== "login" && action.meta.arg.endpointName !== "register"  && action.meta.arg.endpointName !== "loginOauth" && action.meta.arg.endpointName !== "changeLanguage"
        ) {
             toast.success(i18next.t("success", {ns:TranslationNS.Success}), { description: i18next.t("successMessage", {ns:TranslationNS.Success}) });
            }
        }

        return next(action);
    };
