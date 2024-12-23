import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useActivateAccountMutation } from "@/redux/services/authService.ts";

const AccountActivationPage = () => {
    const [params, setParams] = useSearchParams();
    const [verifyAccount] = useActivateAccountMutation();
    const token = params.get("token");
    const ref = useRef(false);
    useEffect(() => {
        if (token && !ref.current) {
            ref.current = true;
            console.log("Account activation token: ", token);
            verifyAccount(token);
            setParams({});
        } else {
            ref.current = true;
            console.log("No account activation token provided");
        }
    }, [token]);

    return <Navigate to={"/login"} />;
};

export default AccountActivationPage;
