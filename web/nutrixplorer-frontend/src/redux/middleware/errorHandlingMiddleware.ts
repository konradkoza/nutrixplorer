import { isFulfilled, isRejected, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { toast } from "sonner";

type ErrorPayload = {
    data?: {
        errorCode: string;
        message: string;
    };
};
// @ts-ignore
export const rtkQueryErrorHandler: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejected(action)) {
        console.error(action.payload);
        const error = action.payload as ErrorPayload;
        toast.error("Błąd", {
            description: error.data ? error.data.errorCode : "Wystąpił błąd",
        });
    }
    if (isFulfilled(action)) {
        // prettier-ignore
        // @ts-expect-error
        if (action.meta.arg.type === "mutation" && action.meta.arg.endpointName !== "login" &&  action.meta.arg.endpointName !== "register"
        ) {
            toast.success("Sukces", { description: "Akcja zakończona pomyślnie" });
        }
    }

    return next(action);
};
