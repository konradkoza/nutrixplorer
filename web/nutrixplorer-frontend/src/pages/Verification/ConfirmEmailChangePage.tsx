import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useChangeEmailFinishMutation } from "@/redux/services/meService";

const ConfirmEmailChangePage = () => {
    const [params, setParams] = useSearchParams();
    const [changeEmail] = useChangeEmailFinishMutation();
    const token = params.get("token");
    const ref = useRef(false);
    useEffect(() => {
        if (token && !ref.current) {
            ref.current = true;
            changeEmail(token);
            setParams({});
        } else {
            ref.current = true;
        }
    }, []);

    return <Navigate to={"/login"} />;
};

export default ConfirmEmailChangePage;
