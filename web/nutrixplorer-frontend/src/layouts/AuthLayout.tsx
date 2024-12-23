import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
    const { token } = useSelector((state: RootState) => state.authSlice);

    if (token) {
        return <Navigate to="/" replace={true} />;
    }

    return <Outlet />;
};

export default AuthLayout;
