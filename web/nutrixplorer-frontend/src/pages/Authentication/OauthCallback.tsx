import Spinner from "@/components/common/Spinner";
import { useLoginOauthMutation } from "@/redux/services/authService";
import { login } from "@/redux/slices/authSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const OauthCallback = () => {
    const [urlParams] = useSearchParams();
    const called = useRef(false);
    const [oAuthLogin, { isLoading }] = useLoginOauthMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            if (called.current) return;
            called.current = true;
            if (urlParams.get("code")) {
                const response = await oAuthLogin(urlParams.get("code")!);

                if (response.error) {
                    navigate("/login");
                }
                if (response.data) {
                    dispatch(login(response.data));
                    navigate("/");
                }
            } else {
                navigate("/login");
            }
        })();
    }, [urlParams]);

    return <>{isLoading && <Spinner />}</>;
};
export default OauthCallback;
