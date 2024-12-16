import i18next from "@/i18n";
import { TranslationNS } from "@/types/TranslationNamespaces";
import { isFulfilled, isRejected, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { toast } from "sonner";

type ErrorPayload = {
    data?: {
        errorCode: string;
        message: string;
    };
};
// prettier-ignore
// @ts-ignore
export const rtkQueryErrorHandler: Middleware = (api: MiddlewareAPI) => (next) => async (action) => {
        if (isRejected(action)) {
            // console.error(action.payload);
            console.log("i18next.hasLoadedNamespace(TranslationNS.Error");
            console.log(i18next.hasLoadedNamespace(TranslationNS.Error));
            const error = action.payload as ErrorPayload;
            if (i18next.isInitialized) {
                toast.error(i18next.t("error", { ns: TranslationNS.Error }), {
                    description: error.data
                        ? i18next.t(error.data.errorCode, { ns: TranslationNS.Error })
                        : i18next.t("connectionError", { ns: TranslationNS.Error }),
                });
            } else {
                // Fallback message if i18next is not initialized
                toast.error("Error", {
                    description: error.data ? error.data.message : "Connection error",
                });
            }
        }
        if (isFulfilled(action)) {
            // prettier-ignore
            // @ts-expect-error
            if (action.meta.arg.type === "mutation" && action.meta.arg.endpointName !== "login" &&  action.meta.arg.endpointName !== "register" && action.meta.arg.endpointName !== "loginOauth"
        ) {
             toast.success(i18next.t("success", {ns:TranslationNS.Success}), { description: i18next.t("successMessage", {ns:TranslationNS.Success}) });
            }
        }

        return next(action);
    };
